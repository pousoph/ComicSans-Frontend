import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { AdminLayout } from '../components/layout/AdminLayout'
import { StatCard } from '../components/ui'
import { Icon } from '../components/ui/Icons'
import { getDashboardStats, getVentasRecientes } from '../services/adminService'
import { fmtCurrency, fmtDate } from '../utils/formatters'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [recentSales, setRecentSales] = useState([])
  const [barData, setBarData] = useState([])

  useEffect(() => {
    getDashboardStats().then(r => { if(r.ok) setStats(r.data); setLoading(false) })
    getVentasRecientes().then(r => {
      if (r.ok) {
        setRecentSales(r.data.slice(0, 5))
        // Group sales by day of week for last 7 days
        const dayLabels = ['D','L','M','M','J','V','S']
        const now = new Date()
        const days = Array.from({length:7}, (_,i) => {
          const d = new Date(now)
          d.setDate(d.getDate() - (6 - i))
          return d
        })
        const grouped = days.map(d => {
          const key = d.toISOString().split('T')[0]
          const total = r.data
            .filter(s => (s.fecha || '').split('T')[0] === key)
            .reduce((acc, s) => acc + s.totalConIva, 0)
          return { day: dayLabels[d.getDay()], val: total }
        })
        setBarData(grouped)
      }
    })
  }, [])

  const barMax = Math.max(...barData.map(b => b.val), 1)

  return (
    <AdminLayout>
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Dashboard</h1>
            <p className={styles.sub}>Bienvenido, {user?.nombre}. Aquí tienes el resumen del negocio.</p>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.btnSecondary} onClick={()=>navigate('/admin/productos')}>
              <Icon name="upload" size={15} strokeWidth={2}/> Cargar Productos
            </button>
            <button className={styles.btnPrimary} onClick={()=>navigate('/admin/reportes')}>
              <Icon name="chart" size={15} strokeWidth={2}/> Ver Reportes
            </button>
          </div>
        </div>

        <div className={styles.statsGrid}>
          {loading ? [1,2,3,4].map(i=><div key={i} className={styles.skelCard}/>) : (<>
            <div className="anim-fadeUp d1">
              <StatCard label="Total Usuarios" value={stats.totalUsuarios}
                sub={`${stats.usuariosActivos} activos`}
                icon={<Icon name="user" size={20} color="var(--c-primary)" strokeWidth={1.5}/>}
                color="green" onClick={()=>navigate('/admin/usuarios')}/>
            </div>
            <div className="anim-fadeUp d2">
              <StatCard label="Total Clientes" value={stats.totalClientes}
                sub={`${stats.clientesActivos} activos`}
                icon={<Icon name="users" size={20} color="var(--c-info)" strokeWidth={1.5}/>}
                color="blue" onClick={()=>navigate('/admin/clientes')}/>
            </div>
            <div className="anim-fadeUp d3">
              <StatCard label="Proveedores" value={stats.totalProveedores}
                sub={`${stats.totalProductos} productos`}
                icon={<Icon name="truck" size={20} color="#7c3aed" strokeWidth={1.5}/>}
                color="purple" onClick={()=>navigate('/admin/proveedores')}/>
            </div>
            <div className="anim-fadeUp d4">
              <StatCard label="Ingresos Totales" value={fmtCurrency(stats.ingresosTotales)}
                sub={`${stats.totalVentas} ventas`}
                icon={<Icon name="dollar-sign" size={20} color="var(--c-warning)" strokeWidth={1.5}/>}
                color="amber" onClick={()=>navigate('/admin/reportes')}/>
            </div>
          </>)}
        </div>

        <div className={styles.bottomGrid}>
          <div className={`${styles.card} anim-fadeUp d3`}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>
                <Icon name="trending-up" size={16} color="var(--c-primary)" strokeWidth={2}/>
                Ingresos de la Semana
              </h3>
              <span className={styles.cardSub}>Últimos 7 días</span>
            </div>
            <div className={styles.chart}>
              {barData.map((b,i) => (
                <div key={i} className={styles.barCol}>
                  <div className={styles.barWrap}>
                    <div className={[styles.bar, b.val===Math.max(...barData.map(x=>x.val))?styles.barActive:''].join(' ')}
                      style={{ height: b.val ? `${(b.val/barMax)*100}%` : '4%' }}/>
                  </div>
                  <span className={styles.barLabel}>{b.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`${styles.card} anim-fadeUp d4`}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>
                <Icon name="receipt" size={16} color="var(--c-primary)" strokeWidth={2}/>
                Ventas Recientes
              </h3>
              <button className={styles.linkBtn} onClick={()=>navigate('/admin/reportes')}>
                Ver todas <Icon name="arrow-right" size={13} strokeWidth={2.5}/>
              </button>
            </div>
            <div className={styles.salesList}>
              {recentSales.length === 0 && (
                <p style={{textAlign:'center',color:'var(--c-text-muted)',padding:'1rem'}}>Sin ventas recientes</p>
              )}
              {recentSales.map(v => (
                <div key={v.codigoVenta} className={styles.saleRow}>
                  <div className={styles.saleAvatar}>
                    {(v.nombreCliente||'?').split(' ').slice(0,2).map(w=>w[0]).join('')}
                  </div>
                  <div className={styles.saleInfo}>
                    <span className={styles.saleName}>{v.nombreCliente}</span>
                    <span className={styles.saleDate}>#{v.codigoVenta} · {fmtDate((v.fecha||'').split('T')[0])}</span>
                  </div>
                  <span className={styles.saleAmount}>{fmtCurrency(v.totalConIva)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`${styles.card} anim-fadeUp d5`}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>
                <Icon name="grid" size={16} color="var(--c-primary)" strokeWidth={2}/>
                Acceso Rápido
              </h3>
            </div>
            <div className={styles.quickList}>
              {[
                { icon:'user-plus', label:'Nuevo Usuario',   sub:'Agregar cajero o admin',    to:'/admin/usuarios' },
                { icon:'user-plus', label:'Nuevo Cliente',   sub:'Registrar cliente',          to:'/admin/clientes' },
                { icon:'building',  label:'Nuevo Proveedor', sub:'Agregar proveedor',          to:'/admin/proveedores' },
                { icon:'upload',    label:'Cargar Productos',sub:'Subir archivo CSV',          to:'/admin/productos' },
                { icon:'chart',     label:'Ver Reportes',    sub:'Usuarios, clientes, ventas', to:'/admin/reportes' },
              ].map(q=>(
                <button key={q.to} className={styles.quickItem} onClick={()=>navigate(q.to)}>
                  <span className={styles.quickIcon}><Icon name={q.icon} size={17} color="var(--c-primary)" strokeWidth={1.75}/></span>
                  <div>
                    <div className={styles.quickLabel}>{q.label}</div>
                    <div className={styles.quickSub}>{q.sub}</div>
                  </div>
                  <Icon name="arrow-right" size={14} color="var(--c-text-muted)" strokeWidth={2}/>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
