import styles from './Card.module.css';

export default function Card({ children, className = '', hoverable = false, glass = false, ...props }) {
  const classes = [
    styles.card,
    hoverable && styles.hoverable,
    glass && styles.glass,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
