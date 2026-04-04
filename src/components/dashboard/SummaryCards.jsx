import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, CreditCard, BadgeDollarSign } from 'lucide-react';
import Card from '../common/Card';
import { usePortfolio } from '../../context/PortfolioContext';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { SkeletonCard } from '../common/Loader';
import { useState, useEffect, useRef } from 'react';
import styles from './SummaryCards.module.css';

// simple count up for numbers
function useCountUp(target, duration = 800) {
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!target || started.current) return;
    started.current = true;

    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      // ease out
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  return value;
}

export default function SummaryCards() {
  const { state } = usePortfolio();

  if (state.isLoading) {
    return (
      <div className={styles.grid}>
        <SkeletonCard count={4} />
      </div>
    );
  }

  const { summary } = state.portfolio;
  const isPositiveToday = summary.todaysChange >= 0;

  return (
    <div className={styles.grid}>
      <SummaryItem
        label="Total Revenue"
        value={summary.totalInvested}
        colorClass={styles.purple}
        icon={<Wallet size={20} />}
      />
      <SummaryItem
        label="Total Expenses"
        value={summary.currentValue}
        colorClass={styles.green}
        icon={<CreditCard size={20} />}
        change={summary.overallReturnPct}
        changeAmt={summary.overallReturn}
      />
      <SummaryItem
        label="Today's Cash Flow"
        value={Math.abs(summary.todaysChange)}
        colorClass={styles.orange}
        icon={isPositiveToday ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
        change={summary.todaysChangePct}
        forceSign={isPositiveToday}
      />
      <SummaryItem
        label="Net Profit"
        value={summary.overallReturn}
        colorClass={styles.blue}
        icon={<BadgeDollarSign size={20} />}
        change={summary.overallReturnPct}
      />
    </div>
  );
}

function SummaryItem({ label, value, colorClass, icon, change, changeAmt, forceSign }) {
  const animatedVal = useCountUp(value);

  return (
    <Card hoverable glass className={`${styles.summaryCard} ${colorClass}`}>
      <div className={styles.cardIcon}>{icon}</div>
      <div className={styles.cardLabel}>{label}</div>
      <div className={styles.cardValue}>{formatCurrency(animatedVal)}</div>
      {change !== undefined && (
        <div className={`${styles.cardChange} ${change >= 0 ? styles.positive : styles.negative}`}>
          {change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {formatPercent(change)}
          {changeAmt && ` (${formatCurrency(changeAmt)})`}
        </div>
      )}
    </Card>
  );
}
