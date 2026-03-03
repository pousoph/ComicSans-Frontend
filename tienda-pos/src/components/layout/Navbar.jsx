import { useAuth } from '../../context/AuthContext'
import { getInitials } from '../../utils/formatters'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../services/authService'
import { Icon } from '../ui/Icons'
import styles from './Navbar.module.css'

export function Navbar() {
  const { user, turnoInicio, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    signOut()
    navigate('/login')
  }

  return (
    <header className={styles.navbar}>
      <div className={styles.brand}>
        <div className={styles.brandIconWrap}>
          <Icon name="store" size={16} color="#fff" strokeWidth={2} />
        </div>
        <span className={styles.brandName}>Comic Sans</span>
        <span className={styles.brandSep} aria-hidden="true" />
        <span className={styles.brandSub}>Punto de Venta</span>
      </div>

      <div className={styles.right}>
        {user && (
          <>
            <div className={styles.turno}>
              <span className={styles.turnoDot} aria-hidden="true" />
              <span>Turno: {turnoInicio}</span>
            </div>
            <div className={styles.user}>
              <div className={styles.avatar} aria-hidden="true">
                {getInitials(user.nombre)}
              </div>
              <span className={styles.userName}>{user.nombre}</span>
            </div>
            <button className={styles.logoutBtn} onClick={handleLogout} type="button">
              <Icon name="log-out" size={15} strokeWidth={2} />
              Salir
            </button>
          </>
        )}
      </div>
    </header>
  )
}
