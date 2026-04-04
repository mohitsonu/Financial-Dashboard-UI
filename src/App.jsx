import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PortfolioProvider } from './context/PortfolioContext';
import { ThemeProvider } from './context/themeContext';
import { RoleProvider } from './context/RoleContext';
import Layout from './components/layout/Layout';
import FundPanel from './components/funds/FundPanel';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Funds from './pages/Funds';
import Insights from './pages/Insights';
import Projects from './pages/Projects';

function App() {
  return (
    <ThemeProvider>
      <RoleProvider>
        <PortfolioProvider>
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/funds" element={<Funds />} />
                <Route path="/insights" element={<Insights />} />
                <Route path="/projects" element={<Projects />} />
              </Routes>
            </Layout>
            {/* fund detail panel sits outside layout so it overlays everything */}
            <FundPanel />
          </BrowserRouter>
        </PortfolioProvider>
      </RoleProvider>
    </ThemeProvider>
  );
}

export default App;
