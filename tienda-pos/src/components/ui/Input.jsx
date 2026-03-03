// ============================================================
// Input.jsx — Input reutilizable con estados y variantes
// ============================================================
import styles from './Input.module.css'

export function Input({
  label,
  id,
  error,
  hint,
  icon,
  iconRight,
  onIconRightClick,
  className = '',
  containerClass = '',
  ...props
}) {
  return (
    <div className={[styles.wrapper, containerClass].join(' ')}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <div className={[styles.inputWrap, error ? styles.hasError : ''].join(' ')}>
        {icon && (
          <span className={styles.iconLeft} aria-hidden="true">{icon}</span>
        )}
        <input
          id={id}
          className={[
            styles.input,
            icon ? styles.withIconLeft : '',
            iconRight ? styles.withIconRight : '',
            error ? styles.error : '',
            className,
          ].filter(Boolean).join(' ')}
          {...props}
        />
        {iconRight && (
          <button
            type="button"
            className={styles.iconRight}
            onClick={onIconRightClick}
            tabIndex={-1}
            aria-label="Toggle"
          >
            {iconRight}
          </button>
        )}
      </div>
      {error && (
        <span className={styles.errorMsg} role="alert">{error}</span>
      )}
      {!error && hint && (
        <span className={styles.hint}>{hint}</span>
      )}
    </div>
  )
}
