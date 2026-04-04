import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import Card from '../common/Card';
import { usePortfolio } from '../../context/PortfolioContext';
import { formatCurrency } from '../../utils/formatters';
import { SkeletonChart } from '../common/Loader';
import { useState } from 'react';
import styles from './PortfolioCharts.module.css';

export default function PortfolioCharts() {
  const { state } = usePortfolio();
  const [activePeriod, setActivePeriod] = useState('1Y');

  if (state.isLoading) {
    return (
      <div className={styles.wrapper}>
        <SkeletonChart />
        <SkeletonChart />
      </div>
    );
  }

  const { categoryBreakdown, monthlyReturns } = state.portfolio;

  return (
    <div className={styles.wrapper}>
      {/* allocation donut */}
      <Card className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <span className={styles.chartTitle}>Spending Breakdown</span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={categoryBreakdown}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              dataKey="value"
              stroke="none"
              paddingAngle={3}
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
                fontSize: '13px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className={styles.legendList}>
          {categoryBreakdown.map((item, i) => (
            <div key={i} className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: item.color }}></span>
              {item.name}
            </div>
          ))}
        </div>
      </Card>

      {/* portfolio trend */}
      <Card className={styles.areaCard}>
        <div className={styles.chartHeader}>
          <span className={styles.chartTitle}>Cash Flow Trend</span>
          <div className={styles.periodTabs}>
            {['6M', '1Y'].map(p => (
              <button
                key={p}
                className={`${styles.periodTab} ${activePeriod === p ? styles.active : ''}`}
                onClick={() => setActivePeriod(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={activePeriod === '6M' ? monthlyReturns.slice(-6) : monthlyReturns}>
            <defs>
              <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
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
              tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(val) => [formatCurrency(val), 'Balance']}
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
              stroke="var(--accent)"
              strokeWidth={2}
              fill="url(#colorVal)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
