import { Sun, Moon, Bell, Search, ShieldCheck, Eye, ChevronDown } from 'lucide-react';
import { useTheme } from '../../context/themeContext';
import { useRole, ROLES } from '../../context/RoleContext';
import { usePortfolio } from '../../context/PortfolioContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import styles from './TopBar.module.css';

const pageTitles = {
  '/': { title: 'Dashboard', sub: 'Welcome back! Here\'s your financial overview.' },
  '/transactions': { title: 'Transactions', sub: 'View and manage your business transactions.' },
  '/funds': { title: 'Accounts', sub: 'Overview of your business accounts and payment channels.' },
  '/insights': { title: 'Insights', sub: 'Track your business performance and spending trends.' },
  '/projects': { title: 'Other Projects', sub: 'Explore my recent projects and technical portfolio.' },
};

export default function TopBar() {
  const { isDark, toggleTheme } = useTheme();
  const { role, setRole, isAdmin } = useRole();
  const { state, dispatch } = usePortfolio(); // getting actual global context!
  const location = useLocation();
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState('');
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef(null);

  const page = pageTitles[location.pathname] || pageTitles['/'];

  const unreadCount = state.notifications?.filter(n => n.unread).length || 0;

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSearch(e) {
    const val = e.target.value;
    setSearchVal(val);
    if (val.trim()) {
      navigate('/transactions', { state: { search: val } });
    }
  }

  function handleSearchKeyDown(e) {
    if (e.key === 'Enter' && searchVal.trim()) {
      navigate('/transactions', { state: { search: searchVal } });
    }
  }

  function toggleRole() {
    setRole(prev => prev === ROLES.VIEWER ? ROLES.ADMIN : ROLES.VIEWER);
  }

  function markAllRead() {
    dispatch({ type: 'MARK_ALL_NOTIFS_READ' });
  }

  function markRead(id) {
    dispatch({ type: 'MARK_NOTIF_READ', payload: id });
  }

  return (
    <header className={styles.topbar}>
      <div className={styles.pageTitle}>
        <h1>{page.title}</h1>
        <p>{page.sub}</p>
      </div>

      <div className={styles.actions}>
        <div className={styles.searchBox}>
          <Search size={16} />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchVal}
            onChange={handleSearch}
            onKeyDown={handleSearchKeyDown}
          />
        </div>

        {/* role switcher — core RBAC requirement */}
        <button
          className={`${styles.roleBtn} ${isAdmin ? styles.roleBtnAdmin : styles.roleBtnViewer}`}
          onClick={toggleRole}
          title={`Currently: ${role}. Click to switch.`}
        >
          {isAdmin ? <ShieldCheck size={15} /> : <Eye size={15} />}
          <span>{isAdmin ? 'Admin' : 'Viewer'}</span>
          <ChevronDown size={13} />
        </button>

        <button className={styles.themeBtn} onClick={toggleTheme} title="Toggle theme">
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className={styles.notifWrap} ref={notifRef}>
          <button 
            className={`${styles.notifBtn} ${showNotif ? styles.active : ''}`} 
            onClick={() => setShowNotif(!showNotif)}
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className={styles.notifDot}></span>}
          </button>

          {showNotif && (
            <div className={styles.notifDropdown}>
              <div className={styles.notifHeader}>
                Notifications
                {unreadCount > 0 && (
                  <button className={styles.markRead} onClick={markAllRead}>
                    Mark all read
                  </button>
                )}
              </div>
              <div className={styles.notifList}>
                {state.notifications?.map(n => (
                  <button 
                    key={n.id} 
                    className={`${styles.notifItem} ${n.unread ? styles.unread : ''}`}
                    onClick={() => markRead(n.id)}
                  >
                    <strong>{n.title}</strong>
                    {n.desc}
                    <span className={styles.notifTime}>{n.time}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
