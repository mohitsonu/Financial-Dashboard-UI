import SummaryCards from '../components/dashboard/SummaryCards';
import PortfolioCharts from '../components/dashboard/PortfolioCharts';
import HoldingsTable from '../components/dashboard/HoldingsTable';

export default function Dashboard() {
  return (
    <div className="page-enter">
      <SummaryCards />
      <PortfolioCharts />
      <HoldingsTable />
    </div>
  );
}
