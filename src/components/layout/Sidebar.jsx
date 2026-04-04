import { NavLink, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, TrendingUp, Landmark, Menu, X } from 'lucide-react';
import { useState } from 'react';
import styles from './Sidebar.module.css';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { path: '/funds', label: 'Accounts', icon: Landmark },
  { path: '/insights', label: 'Insights', icon: TrendingUp },
];

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <button
        className={`${styles.hamburger} ${mobileOpen ? styles.hidden : ''}`}
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      <div
        className={`${styles.overlay} ${mobileOpen ? styles.visible : ''}`}
        onClick={closeMobile}
      />

      <aside className={`${styles.sidebar} ${mobileOpen ? styles.open : ''}`}>
        <div className={styles.headerRow}>
          <div className={styles.logo}>
            <img src="/logo.png" alt="zorvyn fintech" className={styles.logoImg} />
          </div>
          <button className={styles.closeSidebar} onClick={closeMobile} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <div className={styles.navLabel}>Menu</div>
        <nav className={styles.nav}>
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeMobile}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
            >
              <item.icon size={19} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.userSection}>
          <div className={styles.avatar}>PM</div>
          <div>
            <div className={styles.userName}>Palla Mohit Yadav</div>
            <div className={styles.userEmail}>mohitsonu33@gmail.com</div>
            <Link to="/projects" className={styles.projectsLink} onClick={closeMobile} target="_blank" rel="noopener noreferrer">
              Other projects &rarr;
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
