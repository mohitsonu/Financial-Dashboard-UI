import styles from './Badge.module.css';

// variant: success | danger | warning | neutral
export default function Badge({ children, variant = 'neutral' }) {
  return (
    <span className={`${styles.badge} ${styles[variant]}`}>
      {children}
    </span>
  );
}
