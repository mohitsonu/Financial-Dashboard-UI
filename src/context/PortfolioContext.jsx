import { createContext, useContext, useReducer, useEffect } from 'react';
import portfolioData from '../data/portfolio.json';
import transactionsData from '../data/transactions.json';
import fundsData from '../data/funds.json';

const PortfolioContext = createContext(null);

const STORAGE_KEY = 'zorvyn_biz_txn';

const initialState = {
  portfolio: null,
  transactions: [],
  funds: [],
  notifications: [
    { id: 'notif_init', title: 'Welcome to Zorvyn', desc: 'Your financial dashboard is ready.', time: 'Just now', unread: false }
  ],
  isLoading: true,
  selectedFundId: null,
  showFundPanel: false,
};

function portfolioReducer(state, action) {
  switch (action.type) {
    case 'SET_DATA':
      return {
        ...state,
        portfolio: action.payload.portfolio,
        transactions: action.payload.transactions,
        funds: action.payload.funds,
        isLoading: false,
      };
    case 'SELECT_FUND':
      return {
        ...state,
        selectedFundId: action.payload,
        showFundPanel: true,
      };
    case 'CLOSE_FUND_PANEL':
      return { ...state, showFundPanel: false, selectedFundId: null };
    case 'ADD_TRANSACTION': {
      const isSpend = action.payload.type === 'Payout' || action.payload.type === 'Recurring';
      const label = isSpend ? 'Debit Alert' : 'Credit Received';
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
        notifications: [
          {
            id: `notif_${Date.now()}`,
            title: label,
            desc: `₹${action.payload.amount} logged for ${action.payload.fundName}.`,
            time: 'Just now',
            unread: true,
          },
          ...state.notifications
        ].slice(0, 50), // keep last 50
      };
    }
    case 'EDIT_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === action.payload.id ? { ...t, ...action.payload } : t
        ),
        notifications: [
          {
            id: `notif_${Date.now()}`,
            title: 'Transaction Updated',
            desc: `Changes saved for ${action.payload.fundName}.`,
            time: 'Just now',
            unread: true,
          },
          ...state.notifications
        ].slice(0, 50),
      };
    case 'MARK_NOTIF_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => 
          n.id === action.payload ? { ...n, unread: false } : n
        )
      };
    case 'MARK_ALL_NOTIFS_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => ({ ...n, unread: false }))
      };
    default:
      return state;
  }
}

export function PortfolioProvider({ children }) {
  const [state, dispatch] = useReducer(portfolioReducer, initialState);

  // on mount — load data with a small delay to show the skeleton states
  // if the user has previously added/edited transactions, pull those from localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      let transactions = transactionsData;

      // check if there's saved transaction data from a previous session
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          // basic sanity check — make sure it's actually an array
          if (Array.isArray(parsed) && parsed.length > 0) {
            // strip any legacy fields (nav, units) from old cached data
            transactions = parsed.map(({ nav, units, ...rest }) => rest);
          }
        }
      } catch (err) {
        // corrupted data? just ignore it and use defaults
        console.warn('Could not restore saved transactions:', err);
      }

      dispatch({
        type: 'SET_DATA',
        payload: {
          portfolio: portfolioData,
          transactions,
          funds: fundsData,
        },
      });
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // whenever transactions change, persist to localStorage
  // skip the initial empty array (before data loads)
  useEffect(() => {
    if (!state.isLoading && state.transactions.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.transactions));
      } catch (err) {
        // localStorage full or disabled? not much we can do
        console.warn('Could not save transactions:', err);
      }
    }
  }, [state.transactions, state.isLoading]);

  return (
    <PortfolioContext.Provider value={{ state, dispatch }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be used inside PortfolioProvider');
  return ctx;
}
