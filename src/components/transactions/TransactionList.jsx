import { useState } from 'react';
import { Search, ArrowDownLeft, ArrowUpRight, RefreshCw, ChevronDown, Inbox, Plus, Lock, ShieldCheck, Pencil, Download } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { usePortfolio } from '../../context/PortfolioContext';
import { useRole } from '../../context/RoleContext';
import useFilteredTransactions from '../../hooks/useFilteredTransactions';
import { formatCurrency, formatCurrencyDecimal, formatDate } from '../../utils/formatters';
import { exportAsCSV, exportAsJSON } from '../../utils/exportData';
import { SkeletonRows } from '../common/Loader';
import AddTransactionModal from './AddTransactionModal';
import styles from './TransactionList.module.css';

const typeIcons = {
  Invoice: ArrowDownLeft,
  Payout: ArrowUpRight,
  Recurring: RefreshCw,
};

export default function TransactionList() {
  const { state } = usePortfolio();
  const location = useLocation();
  const initialSearch = location.state?.search || '';

  if (state.isLoading) return <SkeletonRows count={6} />;

  return <TransactionListInner transactions={state.transactions} initialSearch={initialSearch} />;
}


// separated so the hook doesn't run when loading
function TransactionListInner({ transactions, initialSearch }) {
  const { isAdmin } = useRole();
  const [showModal, setShowModal] = useState(false);
  // editTxn holds the transaction being edited, null means Add mode
  const [editTxn, setEditTxn] = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const {
    filtered,
    search, setSearch,
    typeFilter, setTypeFilter,
    statusFilter, setStatusFilter,
    sortBy, setSortBy,
  } = useFilteredTransactions(transactions, initialSearch);


  const types = ['all', 'Invoice', 'Payout', 'Recurring'];

  function handleExport(format) {
    // export whatever is currently visible (respects active filters)
    if (format === 'csv') exportAsCSV(filtered);
    if (format === 'json') exportAsJSON(filtered);
    setShowExportMenu(false);
  }

  return (
    <>
      {/* role-aware action bar */}
      <div className={styles.actionBar}>
        <div className={styles.roleIndicator}>
          {isAdmin ? (
            <span className={styles.adminTag}>
              <ShieldCheck size={13} /> Admin Mode — Add or edit transactions
            </span>
          ) : (
            <span className={styles.viewerTag}>
              <Lock size={13} /> Viewer Mode — Read only
            </span>
          )}
        </div>
        <div className={styles.actionBtns}>
          {/* export dropdown — available to all roles */}
          <div className={styles.exportWrap}>
            <button
              className={styles.exportBtn}
              onClick={() => setShowExportMenu(!showExportMenu)}
              title="Export transactions"
            >
              <Download size={15} />
              Export
              <ChevronDown size={13} />
            </button>
            {showExportMenu && (
              <div className={styles.exportMenu}>
                <button onClick={() => handleExport('csv')}>
                  Download as CSV
                </button>
                <button onClick={() => handleExport('json')}>
                  Download as JSON
                </button>
              </div>
            )}
          </div>
          {isAdmin && (
            <button className={styles.addBtn} onClick={() => setShowModal(true)}>
              <Plus size={16} />
              Add Transaction
            </button>
          )}
        </div>
      </div>

      {showModal && (
        <AddTransactionModal
          onClose={() => { setShowModal(false); setEditTxn(null); }}
          editTxn={editTxn}
        />
      )}

      {/* filters */}
      <div className={styles.filters}>

        <div className={styles.searchWrap}>
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className={styles.filterGroup}>
          {types.map(t => (
            <button
              key={t}
              className={`${styles.filterBtn} ${typeFilter === t ? styles.active : ''}`}
              onClick={() => setTypeFilter(t)}
            >
              {t === 'all' ? 'All' : t}
            </button>
          ))}
        </div>

        <div className={styles.selectWrap}>
          <select
            className={styles.select}
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>
          <ChevronDown size={14} className={styles.selectArrow} />
        </div>

        <div className={styles.selectWrap}>
          <select
            className={styles.select}
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
          </select>
          <ChevronDown size={14} className={styles.selectArrow} />
        </div>
      </div>

      <div className={styles.resultCount}>
        Showing {filtered.length} of {transactions.length} transactions
      </div>

      {/* list */}
      {filtered.length === 0 ? (
        <div className={styles.emptyState}>
          <Inbox size={40} />
          <p>No transactions match your filters</p>
        </div>
      ) : (
        <div className={styles.txnList}>
          {filtered.map(txn => {
            const Icon = typeIcons[txn.type] || RefreshCw;
            const iconClass = txn.type.toLowerCase();

            return (
              <div key={txn.id} className={styles.txnRow}>
                <div className={`${styles.txnIcon} ${styles[iconClass]}`}>
                  <Icon size={18} />
                </div>

                <div className={styles.txnInfo}>
                  <div className={styles.txnFund}>{txn.fundName}</div>
                  <div className={styles.txnMeta}>
                    <span>{txn.type}</span>
                    <span>{formatDate(txn.date)}</span>
                  </div>
                </div>

                <div className={styles.txnRight}>
                  <div className={styles.txnAmount}>
                    {txn.type === 'Invoice' ? '+ ' : '- '}
                    {formatCurrency(txn.amount)}
                  </div>
                  <div className={`${styles.txnStatus} ${styles[`status${txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}`]}`}>
                    <span className={styles.statusDot}></span>
                    {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                  </div>
                  {isAdmin && (
                    <button
                      className={styles.editBtn}
                      onClick={() => { setEditTxn(txn); setShowModal(true); }}
                      title="Edit transaction"
                    >
                      <Pencil size={13} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
