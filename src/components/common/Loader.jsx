import styles from './Loader.module.css';

export function Spinner() {
  return (
    <div className={styles.loaderWrap}>
      <div className={styles.spinner}></div>
    </div>
  );
}

// different skeleton shapes for loading states
export function SkeletonCard({ count = 1 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`skeleton ${styles.skeletonCard}`}></div>
      ))}
    </>
  );
}

export function SkeletonRows({ count = 5 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`skeleton ${styles.skeletonRow}`}></div>
      ))}
    </>
  );
}

export function SkeletonChart() {
  return <div className={`skeleton ${styles.skeletonChart}`}></div>;
}
