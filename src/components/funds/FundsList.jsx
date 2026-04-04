import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { usePortfolio } from '../../context/PortfolioContext';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { SkeletonCard } from '../common/Loader';
import styles from './FundsList.module.css';

export default function FundsList() {
  const { state, dispatch } = usePortfolio();

  if (state.isLoading) {
    return (
      <div className={styles.fundsGrid}>
        <SkeletonCard count={6} />
      </div>
    );
  }

  const { holdings } = state.portfolio;

  function openFund(id) {
    dispatch({ type: 'SELECT_FUND', payload: id });
  }

  return (
    <div className={styles.fundsGrid}>
      {holdings.map(fund => {
        const isPositive = fund.returnPct >= 0;
        return (
          <Card
            key={fund.id}
            className={styles.fundCard}
            onClick={() => openFund(fund.id)}
          >
            <div className={styles.fundCardHeader}>
              <div>
                <div className={styles.fundCardName}>
                  {fund.fundName.split(' - ')[0]}
                </div>
                <div className={styles.fundCardCat}>{fund.category}</div>
              </div>
              <Badge variant={isPositive ? 'success' : 'danger'}>
                {isPositive ? '▲' : '▼'} {formatPercent(fund.returnPct)}
              </Badge>
            </div>

            <div className={styles.fundCardStats}>
              <div className={styles.fundCardStat}>
                <span className={styles.statSmallLabel}>Budget</span>
                <span className={styles.statSmallValue}>{formatCurrency(fund.invested)}</span>
              </div>
              <div className={styles.fundCardStat}>
                <span className={styles.statSmallLabel}>Balance</span>
                <span className={styles.statSmallValue}>{formatCurrency(fund.currentValue)}</span>
              </div>
              <div className={styles.fundCardStat}>
                <span className={styles.statSmallLabel}>Txns</span>
                <span className={styles.statSmallValue}>{fund.txnCount}</span>
              </div>
              <div className={styles.fundCardStat}>
                <span className={styles.statSmallLabel}>Type</span>
                <span className={styles.statSmallValue}>{fund.category}</span>
              </div>
            </div>

            <div className={styles.fundCardFooter}>
              <div className={`${styles.returnBadge} ${isPositive ? styles.positive : styles.negative}`} style={{ color: isPositive ? 'var(--success)' : 'var(--danger)' }}>
                {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                {formatCurrency(Math.abs(fund.returnAmt))}
              </div>
              <button className={styles.viewBtn}>View Details →</button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
