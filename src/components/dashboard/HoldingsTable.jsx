import { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, ChevronUp, ChevronDown, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../common/Card';
import { usePortfolio } from '../../context/PortfolioContext';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { SkeletonRows } from '../common/Loader';
import styles from './HoldingsTable.module.css';

export default function HoldingsTable() {
  const { state, dispatch } = usePortfolio();
  const [sortKey, setSortKey] = useState('currentValue');
  const [sortAsc, setSortAsc] = useState(false);

  if (state.isLoading) {
    return (
      <Card>
        <SkeletonRows count={5} />
      </Card>
    );
  }

  const holdings = [...state.portfolio.holdings].sort((a, b) => {
    const diff = a[sortKey] - b[sortKey];
    return sortAsc ? diff : -diff;
  });

  function handleSort(key) {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  }

  function handleRowClick(id) {
    dispatch({ type: 'SELECT_FUND', payload: id });
  }

  const SortArrow = ({ column }) => {
    if (sortKey !== column) return null;
    return (
      <span className={styles.sortIcon}>
        {sortAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </span>
    );
  };

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h3 className={styles.title}>Your Accounts</h3>
        <Link to="/funds" className={styles.viewAll}>View All →</Link>
      </div>

      <Card>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Account</th>
                <th onClick={() => handleSort('invested')}>
                  Budget <SortArrow column="invested" />
                </th>
                <th onClick={() => handleSort('currentValue')}>
                  Balance <SortArrow column="currentValue" />
                </th>
                <th onClick={() => handleSort('returnPct')}>
                  Change <SortArrow column="returnPct" />
                </th>
                <th className={styles.hideOnMobile}>Type</th>
                <th className={styles.hideOnMobile}>Auto-pay</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map(h => (
                <tr key={h.id} onClick={() => handleRowClick(h.id)}>
                  <td>
                    <div className={styles.fundNameCell}>
                      <span className={styles.fundName}>{h.fundName.split(' - ')[0]}</span>
                      <span className={styles.fundCategory}>{h.category}</span>
                    </div>
                  </td>
                  <td className={styles.monoVal}>{formatCurrency(h.invested)}</td>
                  <td className={styles.monoVal}>{formatCurrency(h.currentValue)}</td>
                  <td>
                    <div className={`${styles.monoVal} ${h.returnPct >= 0 ? styles.positive : styles.negative}`}>
                      {h.returnPct >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {' '}{formatPercent(h.returnPct)}
                    </div>
                  </td>
                  <td className={`${styles.monoVal} ${styles.hideOnMobile}`}>{h.category}</td>
                  <td className={styles.hideOnMobile}>
                    {h.sipActive ? (
                      <span className={styles.sipBadge}>
                        <RefreshCw size={11} />
                        {formatCurrency(h.sipAmount)}/mo
                      </span>
                    ) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
