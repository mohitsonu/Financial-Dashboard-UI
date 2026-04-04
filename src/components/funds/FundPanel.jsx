import { X, TrendingUp, TrendingDown, Info, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { usePortfolio } from '../../context/PortfolioContext';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import styles from './FundPanel.module.css';

export default function FundPanel() {
  const { state, dispatch } = usePortfolio();

  if (!state.showFundPanel || !state.selectedFundId) return null;

  const holding = state.portfolio.holdings.find(h => h.id === state.selectedFundId);
  const fundDetail = state.funds.find(f => f.id === state.selectedFundId);

  if (!holding || !fundDetail) return null;

  const isProfit = holding.returnAmt >= 0;

  const close = () => dispatch({ type: 'CLOSE_FUND_PANEL' });

  // figure out risk badge class
  const riskClass = fundDetail.riskLevel === 'Very High' ? styles.riskVeryHigh
    : fundDetail.riskLevel === 'High' ? styles.riskHigh
    : styles.riskModerate;

  return (
    <>
      <div
        className={`${styles.overlay} ${styles.visible}`}
        onClick={close}
      />
      <div className={`${styles.panel} ${styles.open}`}>
        <div className={styles.panelHeader}>
          <div>
            <div className={styles.fundTitle}>{holding.fundName}</div>
            <div className={styles.fundMeta}>{holding.category} • {holding.amc}</div>
          </div>
          <button className={styles.closeBtn} onClick={close}>
            <X size={18} />
          </button>
        </div>

        <div className={styles.panelBody}>
          {/* gain/loss hero bar */}
          <div className={`${styles.gainBar} ${isProfit ? styles.profit : styles.loss}`}>
            <div className={styles.gainIcon}>
              {isProfit ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
            </div>
            <div className={styles.gainText}>
              <div className={styles.gainLabel}>{isProfit ? 'Net Surplus' : 'Net Deficit'}</div>
              <div className={styles.gainAmount}>
                {formatCurrency(Math.abs(holding.returnAmt))} ({formatPercent(holding.returnPct)})
              </div>
            </div>
          </div>

          {/* key stats */}
          <div className={styles.statsGrid}>
            <div className={styles.statBox}>
              <div className={styles.statLabel}>Budget</div>
              <div className={styles.statValue}>{formatCurrency(holding.invested)}</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statLabel}>Balance</div>
              <div className={`${styles.statValue} ${isProfit ? styles.positive : styles.negative}`}>
                {formatCurrency(holding.currentValue)}
              </div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statLabel}>Transactions</div>
              <div className={styles.statValue}>{holding.txnCount}</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statLabel}>Current Bal.</div>
              <div className={styles.statValue}>{formatCurrency(holding.currentValue)}</div>
            </div>
          </div>

          {/* NAV trend chart */}
          <div className={styles.sectionTitle}>
            <BarChart3 size={16} />
            Balance Trend (6 Months)
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={fundDetail.balanceHistory}>
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
                axisLine={false}
                tickLine={false}
                interval={0}
              />
              <YAxis
                domain={['auto', 'auto']}
                tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
                axisLine={false}
                tickLine={false}
                width={50}
                tickFormatter={(v) => `₹${v}`}
              />
              <Tooltip
                formatter={(val) => [formatCurrency(val), 'Balance']}
                contentStyle={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="var(--accent)"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>

          {/* returns table */}
          <div className={styles.sectionTitle} style={{ marginTop: 28 }}>
            <TrendingUp size={16} />
            Volume Change
          </div>
          <table className={styles.returnsTable}>
            <thead>
              <tr>
                <th>1M</th>
                <th>3M</th>
                <th>6M</th>
                <th>1Y</th>
                <th>3Y</th>
                <th>5Y</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                {Object.values(fundDetail.returns).map((val, i) => (
                  <td
                    key={i}
                    style={{ color: val >= 0 ? 'var(--success)' : 'var(--danger)' }}
                  >
                    {formatPercent(val)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>

          {/* fund info */}
          <div className={styles.sectionTitle}>
            <Info size={16} />
            Account Information
          </div>
          <div className={styles.infoGrid}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Account No.</span>
              <span className={styles.infoValue}>{holding.folioNo}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Account Type</span>
              <span className={`${styles.riskBadge} ${riskClass}`}>{fundDetail.riskLevel}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Settlement</span>
              <span className={styles.infoValue}>{fundDetail.benchmark}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Fees</span>
              <span className={styles.infoValue}>{fundDetail.expenseRatio}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Account Balance</span>
              <span className={styles.infoValue}>{fundDetail.aum}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Auto-pay Active</span>
              <span className={styles.infoValue}>
                {holding.sipActive ? `Yes (${formatCurrency(holding.sipAmount)}/mo)` : 'No'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
