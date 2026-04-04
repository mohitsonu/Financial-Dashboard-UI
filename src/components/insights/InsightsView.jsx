import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  AreaChart, Area, CartesianGrid,
} from 'recharts';
import { TrendingUp, Award, PieChart as PieIcon, Activity, Layers, Target } from 'lucide-react';
import Card from '../common/Card';
import { usePortfolio } from '../../context/PortfolioContext';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { SkeletonChart, SkeletonCard } from '../common/Loader';
import styles from './Insights.module.css';

export default function InsightsView() {
  const { state } = usePortfolio();

  if (state.isLoading) {
    return (
      <div className="page-enter">
        <div className={styles.quickStats}>
          <SkeletonCard count={3} />
        </div>
        <div className={styles.insightsGrid}>
          <SkeletonChart />
          <SkeletonChart />
        </div>
      </div>
    );
  }

  const { holdings, categoryBreakdown, monthlyReturns, summary } = state.portfolio;

  // calculate monthly change percentages
  const monthlyChanges = monthlyReturns.map((item, idx) => {
    if (idx === 0) return { ...item, change: 0 };
    const prev = monthlyReturns[idx - 1].value;
    const changePct = ((item.value - prev) / prev) * 100;
    return { ...item, change: parseFloat(changePct.toFixed(2)) };
  }).slice(1); // skip first since it has no prev

  // sort holdings by return for top/bottom
  const sortedByReturn = [...holdings].sort((a, b) => b.returnPct - a.returnPct);
  const topPerformers = sortedByReturn.slice(0, 3);
  const bottomPerformers = sortedByReturn.slice(-2).reverse();

  const activeSips = holdings.filter(h => h.sipActive).length;
  const totalSipAmount = holdings
    .filter(h => h.sipActive)
    .reduce((sum, h) => sum + (h.sipAmount || 0), 0);

  return (
    <div className="page-enter">
      {/* quick overview stats */}
      <div className={styles.quickStats}>
        <Card className={styles.quickStatCard}>
          <div className={styles.quickStatIcon} style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
            <Layers size={22} />
          </div>
          <div className={styles.quickStatValue}>{holdings.length}</div>
          <div className={styles.quickStatLabel}>Total Accounts</div>
        </Card>
        <Card className={styles.quickStatCard}>
          <div className={styles.quickStatIcon} style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
            <Activity size={22} />
          </div>
          <div className={styles.quickStatValue}>{activeSips}</div>
          <div className={styles.quickStatLabel}>Auto-payments ({formatCurrency(totalSipAmount)}/mo)</div>
        </Card>
        <Card className={styles.quickStatCard}>
          <div className={styles.quickStatIcon} style={{ background: 'var(--warning-bg)', color: '#E67E22' }}>
            <Target size={22} />
          </div>
          <div className={styles.quickStatValue}>{formatPercent(summary.overallReturnPct)}</div>
          <div className={styles.quickStatLabel}>Profit Margin</div>
        </Card>
      </div>

      <div className={styles.insightsGrid}>
        {/* monthly returns bar chart */}
        <Card className={`${styles.chartCard} ${styles.fullWidth}`}>
          <div className={styles.chartHeader}>
            <div>
              <div className={styles.chartTitle}>Monthly Cash Flow</div>
              <div className={styles.chartSubtitle}>Month-over-month cash flow change</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyChanges}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
                axisLine={false}
                tickLine={false}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={50}
              />
              <YAxis
                tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                formatter={(val) => [`${val}%`, 'Change']}
                contentStyle={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '13px',
                }}
              />
              <Bar
                dataKey="change"
                radius={[4, 4, 0, 0]}
                fill="var(--accent)"
              >
                {monthlyChanges.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.change >= 0 ? 'var(--success)' : 'var(--danger)'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* allocation donut */}
        <Card className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div>
              <div className={styles.chartTitle}>Expense Breakdown</div>
              <div className={styles.chartSubtitle}>Distribution by category</div>
            </div>
            <PieIcon size={18} style={{ color: 'var(--text-muted)' }} />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={categoryBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                dataKey="value"
                stroke="none"
                paddingAngle={3}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {categoryBreakdown.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val) => formatCurrency(val)}
                contentStyle={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* top performers */}
        <Card className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div>
              <div className={styles.chartTitle}>Top Accounts</div>
              <div className={styles.chartSubtitle}>Best performing accounts by change %</div>
            </div>
            <Award size={18} style={{ color: 'var(--text-muted)' }} />
          </div>

          <div className={styles.performerList}>
            {topPerformers.map((fund, i) => {
              const rankClasses = [styles.rankGold, styles.rankSilver, styles.rankBronze];
              return (
                <div key={fund.id} className={styles.performerItem}>
                  <span className={`${styles.rank} ${rankClasses[i]}`}>{i + 1}</span>
                  <div className={styles.performerInfo}>
                    <div className={styles.performerName}>{fund.fundName.split(' - ')[0]}</div>
                    <div className={styles.performerCat}>{fund.category}</div>
                  </div>
                  <span className={`${styles.performerReturn} ${fund.returnPct >= 0 ? styles.positive : styles.negative}`}>
                    {formatPercent(fund.returnPct)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* bottom performers */}
          <div className={styles.chartTitle} style={{ marginTop: 24, marginBottom: 12, fontSize: 14 }}>
            Needs Attention
          </div>
          <div className={styles.performerList}>
            {bottomPerformers.map(fund => (
              <div key={fund.id} className={styles.performerItem}>
                <span className={`${styles.rank}`} style={{ background: 'var(--border)', color: 'var(--text-secondary)' }}>—</span>
                <div className={styles.performerInfo}>
                  <div className={styles.performerName}>{fund.fundName.split(' - ')[0]}</div>
                  <div className={styles.performerCat}>{fund.category}</div>
                </div>
                <span className={`${styles.performerReturn} ${fund.returnPct >= 0 ? styles.positive : styles.negative}`}>
                  {formatPercent(fund.returnPct)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* portfolio growth area chart */}
      <Card className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <div>
            <div className={styles.chartTitle}>Revenue Growth</div>
            <div className={styles.chartSubtitle}>Your company's cash position over 12 months</div>
          </div>
          <TrendingUp size={18} style={{ color: 'var(--text-muted)' }} />
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={monthlyReturns}>
            <defs>
              <linearGradient id="insightsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--success)" stopOpacity={0.25} />
                <stop offset="100%" stopColor="var(--success)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
              axisLine={false}
              tickLine={false}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={50}
            />
            <YAxis
              tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(val) => [formatCurrency(val), 'Cash Balance']}
              contentStyle={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '13px',
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--success)"
              strokeWidth={2}
              fill="url(#insightsGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
