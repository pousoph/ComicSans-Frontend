// ============================================================
// PageLayout.jsx — Wrapper para páginas con Navbar
// ============================================================
import { Navbar } from './Navbar'
import styles from './PageLayout.module.css'

export function PageLayout({ children }) {
  return (
    <div className={styles.root}>
      <Navbar />
      <main className={styles.main}>
        {children}
      </main>
    </div>
  )
}
