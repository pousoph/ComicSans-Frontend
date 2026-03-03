import styles from './ui.module.css'
import { Icon } from './Icons'

export { Icon }

export function Btn({ children, variant='primary', size='md', loading, icon, iconRight, full, onClick, type='button', disabled, className='', ...r }) {
  return (
    <button type={type} className={[styles.btn,styles[`btn${variant}`],styles[`btnsz${size}`],full?styles.btnFull:'',loading?styles.btnLoading:'',className].join(' ')} disabled={disabled||loading} onClick={onClick} {...r}>
      {loading && <span className={styles.spinner}/>}
      {!loading && icon && <span className={styles.btnIcon}>{icon}</span>}
      <span>{children}</span>
      {!loading && iconRight && <span className={styles.btnIconR}>{iconRight}</span>}
    </button>
  )
}

export function Input({ label, id, error, icon, iconRight, onIconRightClick, containerClass='', ...props }) {
  return (
    <div className={[styles.inputWrap, containerClass].join(' ')}>
      {label && <label htmlFor={id} className={styles.inputLabel}>{label}</label>}
      <div className={[styles.inputInner, error?styles.inputError:''].join(' ')}>
        {icon && <span className={styles.inputIconL}>{icon}</span>}
        <input id={id} className={[styles.input, icon?styles.inputPL:'', iconRight?styles.inputPR:'', error?styles.inputErrorField:''].join(' ')} {...props}/>
        {iconRight && <button type="button" className={styles.inputIconR} onClick={onIconRightClick}>{iconRight}</button>}
      </div>
      {error && <span className={styles.inputErrMsg} role="alert">{error}</span>}
    </div>
  )
}

export function Select({ label, id, error, containerClass='', children, ...props }) {
  return (
    <div className={[styles.inputWrap, containerClass].join(' ')}>
      {label && <label htmlFor={id} className={styles.inputLabel}>{label}</label>}
      <select id={id} className={[styles.select, error?styles.inputErrorField:''].join(' ')} {...props}>{children}</select>
      {error && <span className={styles.inputErrMsg}>{error}</span>}
    </div>
  )
}

export function Badge({ children, color='gray', dot }) {
  return (
    <span className={[styles.badge, styles[`badge${color}`]].join(' ')}>
      {dot && <span className={styles.badgeDot}/>}
      {children}
    </span>
  )
}

export function Avatar({ name='', size='md', color='green' }) {
  const initials = name.split(' ').slice(0,2).map(w=>w[0]||'').join('').toUpperCase()
  return <div className={[styles.avatar, styles[`avatar${size}`], styles[`avatar${color}`]].join(' ')}>{initials}</div>
}

export function StatCard({ label, value, sub, icon, color='green', onClick }) {
  return (
    <div className={[styles.statCard, styles[`statCard${color}`], onClick?styles.statCardClick:''].join(' ')} onClick={onClick} role={onClick?'button':undefined}>
      <div className={styles.statTop}>
        <div className={styles.statIcon}>{icon}</div>
        <div className={styles.statTexts}>
          <span className={styles.statLabel}>{label}</span>
          <span className={styles.statValue}>{value}</span>
        </div>
      </div>
      {sub && <div className={styles.statSub}>{sub}</div>}
    </div>
  )
}

export function Modal({ isOpen, onClose, title, children, width='520px' }) {
  if (!isOpen) return null
  return (
    <div className={styles.overlay} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className={`${styles.modal} anim-scaleIn`} style={{maxWidth:width}}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{title}</h3>
          <button className={styles.modalClose} onClick={onClose} type="button">
            <Icon name="x" size={14} strokeWidth={2.5}/>
          </button>
        </div>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  )
}

export function Confirm({ isOpen, onClose, onConfirm, title='¿Estás seguro?', message, loading, variant='danger' }) {
  if (!isOpen) return null
  return (
    <div className={styles.overlay}>
      <div className={`${styles.modal} ${styles.modalSm} anim-scaleIn`}>
        <div className={styles.confirmIconWrap}>
          <Icon name={variant==='danger'?'trash':'warning'} size={28} color={variant==='danger'?'var(--c-error)':'var(--c-warning)'} strokeWidth={1.5}/>
        </div>
        <h3 className={styles.confirmTitle}>{title}</h3>
        <p className={styles.confirmMsg}>{message}</p>
        <div className={styles.confirmActions}>
          <Btn variant="ghost" size="sm" onClick={onClose} disabled={loading}>Cancelar</Btn>
          <Btn variant={variant==='danger'?'danger':'primary'} size="sm" loading={loading} onClick={onConfirm}>Confirmar</Btn>
        </div>
      </div>
    </div>
  )
}

export function EmptyState({ icon='list', title, message }) {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyIconWrap}><Icon name={icon} size={32} color="var(--c-text-muted)" strokeWidth={1.25}/></div>
      <h4 className={styles.emptyTitle}>{title}</h4>
      {message && <p className={styles.emptyMsg}>{message}</p>}
    </div>
  )
}

export function Toast({ message, type='success', onClose }) {
  if (!message) return null
  const iconMap = { success:'check-circle', error:'x-circle', info:'info', warning:'warning' }
  return (
    <div className={[styles.toast, styles[`toast${type}`]].join(' ')}>
      <span className={styles.toastIcon}><Icon name={iconMap[type]} size={16} strokeWidth={2}/></span>
      <span className={styles.toastMsg}>{message}</span>
      <button className={styles.toastClose} onClick={onClose}><Icon name="x" size={13} strokeWidth={2.5}/></button>
    </div>
  )
}

export function SearchBar({ value, onChange, placeholder='Buscar...' }) {
  return (
    <div className={styles.searchBar}>
      <Icon name="search" size={14} color="var(--c-text-muted)"/>
      <input className={styles.searchInput} value={value} onChange={onChange} placeholder={placeholder}/>
      {value && <button className={styles.searchClear} onClick={()=>onChange({target:{value:''}})}>
        <Icon name="x" size={12} strokeWidth={2.5}/>
      </button>}
    </div>
  )
}
