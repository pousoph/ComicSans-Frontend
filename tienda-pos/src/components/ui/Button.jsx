// ============================================================
// Button.jsx — Componente de botón con todas las variantes
// ============================================================
import styles from './Button.module.css'

/**
 * @param {'primary'|'outline-green'|'outline-red'|'ghost'|'danger'} variant
 * @param {'sm'|'md'|'lg'} size
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconRight,
  className = '',
  onClick,
  type = 'button',
  fullWidth = false,
  ...rest
}) {
  return (
    <button
      type={type}
      className={[
        styles.btn,
        styles[`btn--${variant}`],
        styles[`btn--${size}`],
        fullWidth ? styles['btn--full'] : '',
        loading ? styles['btn--loading'] : '',
        className,
      ].filter(Boolean).join(' ')}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading && (
        <span className={styles.spinner} aria-hidden="true" />
      )}
      {!loading && icon && (
        <span className={styles.iconLeft} aria-hidden="true">{icon}</span>
      )}
      <span className={styles.label}>{children}</span>
      {!loading && iconRight && (
        <span className={styles.iconRight} aria-hidden="true">{iconRight}</span>
      )}
    </button>
  )
}
