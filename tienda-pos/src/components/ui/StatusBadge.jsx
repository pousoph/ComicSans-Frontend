// ============================================================
// StatusBadge.jsx
// ============================================================
import styles from './StatusBadge.module.css'

/**
 * @param {'success'|'error'|'loading'|'info'|'warning'|'neutral'} variant
 */
export function StatusBadge({ variant = 'neutral', children }) {
  return (
    <span className={[styles.badge, styles[`badge--${variant}`]].join(' ')}>
      <span className={styles.dot} aria-hidden="true" />
      {children}
    </span>
  )
}
