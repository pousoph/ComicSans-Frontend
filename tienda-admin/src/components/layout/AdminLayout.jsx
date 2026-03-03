import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getInitials } from '../../utils/formatters'
import { Icon } from '../ui/Icons'
import styles from './AdminLayout.module.css'

const NAV = [
  { to:'/admin',            icon:'dashboard',  label:'Dashboard',    end:true },
  { to:'/admin/usuarios',   icon:'user',       label:'Usuarios' },
  { to:'/admin/clientes',   icon:'users',      label:'Clientes' },
  { to:'/admin/proveedores',icon:'truck',      label:'Proveedores' },
  { to:'/admin/productos',  icon:'package',    label:'Productos' },
  { to:'/admin/reportes',   icon:'chart',      label:'Reportes' },
]

export function AdminLayout({ children }) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => { signOut(); navigate('/admin/login') }

  return (
    <div className={styles.root}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.logo}>
            <div className={styles.logoMark}>
              <Icon name="store" size={18} color="#fff" strokeWidth={2}/>
            </div>
            <div>
              <div className={styles.logoName}>Comic Sans</div>
              <div className={styles.logoSub}>Panel Admin</div>
            </div>
          </div>

          <div className={styles.navSection}>
            <span className={styles.navLabel}>MENÚ</span>
            <nav className={styles.nav}>
              {NAV.map(n => (
                <NavLink key={n.to} to={n.to} end={n.end}
                  className={({ isActive }) => [styles.navItem, isActive ? styles.navActive : ''].join(' ')}>
                  <span className={styles.navIcon}><Icon name={n.icon} size={16} strokeWidth={1.75}/></span>
                  <span className={styles.navLabel2}>{n.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          <div className={styles.navSection}>
            <span className={styles.navLabel}>GENERAL</span>
            <button className={styles.navItem} onClick={handleLogout}>
              <span className={styles.navIcon}><Icon name="log-out" size={16} strokeWidth={1.75}/></span>
              <span className={styles.navLabel2}>Cerrar Sesión</span>
            </button>
          </div>
        </div>

        <div className={styles.userCard}>
          <div className={styles.userAvatar}>{getInitials(user?.nombre || 'A')}</div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{user?.nombre}</div>
            <div className={styles.userRole}>Administrador</div>
          </div>
        </div>
      </aside>

      <div className={styles.main}>
        <header className={styles.topbar}>
          <div className={styles.topbarSearch}>
            <Icon name="search" size={14} color="var(--c-text-muted)"/>
            <input className={styles.searchInputTop} placeholder="Buscar en el sistema..."/>
            <kbd className={styles.searchKbd}>Ctrl+K</kbd>
          </div>
          <div className={styles.topbarRight}>
            <button className={styles.topbarIcon}>
              <Icon name="bell" size={17} color="var(--c-text-soft)"/>
            </button>
            <div className={styles.topbarUser}>
              <div className={styles.topbarAvatar}>{getInitials(user?.nombre || 'A')}</div>
              <div>
                <div className={styles.topbarName}>{user?.nombre}</div>
                <div className={styles.topbarEmail}>{user?.usuario}@comicsans.com</div>
              </div>
            </div>
          </div>
        </header>
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  )
}
