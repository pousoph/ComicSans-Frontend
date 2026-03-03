import { useState, useEffect } from 'react'
import { AdminLayout } from '../components/layout/AdminLayout'
import { Badge, Toast } from '../components/ui'
import { Icon } from '../components/ui/Icons'
import { getReporteUsuarios, getReporteClientes, getReporteVentasPorCliente } from '../services/adminService'
import { fmtCurrency, fmtDate, rolLabel } from '../utils/formatters'
import styles from './Reportes.module.css'

const TABS = [
  { key:'usuarios', label:'Listado de Usuarios', icon:'user'  },
  { key:'clientes', label:'Listado de Clientes', icon:'users' },
  { key:'ventas',   label:'Ventas por Cliente',  icon:'dollar-sign' },
]

export default function Reportes() {
  const [tab,     setTab]     = useState('usuarios')
  const [data,    setData]    = useState({})
  const [loading, setLoading] = useState(false)
  const [toast,   setToast]   = useState(null)
  const [search,  setSearch]  = useState('')

  const load = async t => {
    setLoading(true); setSearch('')
    const fns = { usuarios:getReporteUsuarios, clientes:getReporteClientes, ventas:getReporteVentasPorCliente }
    const r = await fns[t]()
    setLoading(false)
    if (r.ok) setData(prev=>({...prev,[t]:r}))
  }
  useEffect(()=>{ load(tab) },[tab])

  const handleExport = () => setToast({message:'Exportación disponible al conectar con el backend.', type:'info'})

  const rows = data[tab]?.data || []
  const filtered = rows.filter(r => Object.values(r).some(v=>String(v).toLowerCase().includes(search.toLowerCase())))

  return (
    <AdminLayout>
      <div className={styles.page}>
        {toast && <Toast message={toast.message} type={toast.type} onClose={()=>setToast(null)}/>}

        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Reportes</h1>
            <p className={styles.sub}>Consulta y exporta la información del sistema</p>
          </div>
          <button className={styles.exportBtn} onClick={handleExport}>
            <Icon name="download" size={15} strokeWidth={2}/> Exportar Reporte
          </button>
        </div>

        <div className={styles.tabs}>
          {TABS.map(t => (
            <button key={t.key} className={[styles.tab, tab===t.key?styles.tabActive:''].join(' ')} onClick={()=>setTab(t.key)}>
              <Icon name={t.icon} size={15} strokeWidth={tab===t.key?2:1.75}/> {t.label}
            </button>
          ))}
        </div>

        {tab==='ventas' && data.ventas && (
          <div className={styles.summaryRow}>
            {[
              { icon:'receipt',      label:'Clientes con Ventas', value: (data.ventas.data||[]).length },
              { icon:'dollar-sign',  label:'Ingresos Totales',    value: fmtCurrency(data.ventas.granTotal||0) },
              { icon:'trending-up',  label:'Promedio por Cliente',value: fmtCurrency((data.ventas.granTotal||0)/Math.max((data.ventas.data||[]).length,1)) },
            ].map(s=>(
              <div key={s.label} className={styles.summaryCard}>
                <div className={styles.summaryIconWrap}><Icon name={s.icon} size={20} color="var(--c-primary)" strokeWidth={1.5}/></div>
                <div>
                  <span className={styles.summaryLabel}>{s.label}</span>
                  <span className={styles.summaryValue}>{s.value}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={styles.card}>
          <div className={styles.cardTop}>
            <div className={styles.searchWrap}>
              <Icon name="search" size={13} color="var(--c-text-muted)"/>
              <input className={styles.searchInput}
                placeholder={`Buscar en ${TABS.find(t=>t.key===tab)?.label.toLowerCase()}...`}
                value={search} onChange={e=>setSearch(e.target.value)}/>
              {search && <button className={styles.searchClear} onClick={()=>setSearch('')}>
                <Icon name="x" size={12} strokeWidth={2.5}/>
              </button>}
            </div>
            <span className={styles.rowCount}>{filtered.length} registro{filtered.length!==1?'s':''}</span>
          </div>

          {loading ? (
            <div className={styles.skelWrap}>{[1,2,3,4,5].map(i=><div key={i} className={styles.skelRow}/>)}</div>
          ) : filtered.length===0 ? (
            <div className={styles.empty}>
              <Icon name="search" size={36} color="var(--c-text-muted)" strokeWidth={1}/>
              <p>Sin resultados</p>
            </div>
          ) : (
            <div className={styles.tableWrap}>
              {tab==='usuarios' && <TablaUsuarios rows={filtered}/>}
              {tab==='clientes' && <TablaClientes rows={filtered}/>}
              {tab==='ventas'   && <TablaVentas   rows={filtered}/>}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

function TablaUsuarios({ rows }) {
  return (
    <table className={styles.table}>
      <thead><tr><th>Usuario</th><th>Cédula</th><th>Correo</th><th>Rol</th><th>Estado</th><th>Creado</th></tr></thead>
      <tbody>
        {rows.map(u=>(
          <tr key={u.id} className={styles.tr}>
            <td className={styles.td}>
              <div className={styles.userCell}>
                <div className={styles.userAvatar}>{u.nombre.split(' ').slice(0,2).map(w=>w[0]).join('')}</div>
                <div><div className={styles.userName}>{u.nombre}</div><div className={styles.userUsername}>@{u.usuario}</div></div>
              </div>
            </td>
            <td className={`${styles.td} ${styles.mono}`}>{u.cedula}</td>
            <td className={`${styles.td} ${styles.muted}`}>{u.correo}</td>
            <td className={styles.td}><Badge color={u.rol==='ADMIN'?'purple':'blue'}>{rolLabel(u.rol)}</Badge></td>
            <td className={styles.td}><Badge color={u.estado?'green':'gray'} dot>{u.estado?'Activo':'Inactivo'}</Badge></td>
            <td className={`${styles.td} ${styles.muted}`}>{fmtDate(u.fechaCreacion)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function TablaClientes({ rows }) {
  return (
    <table className={styles.table}>
      <thead><tr><th>Cliente</th><th>Cédula</th><th>Teléfono</th><th>Dirección</th><th>Estado</th><th>Registrado</th></tr></thead>
      <tbody>
        {rows.map(c=>(
          <tr key={c.id} className={styles.tr}>
            <td className={styles.td}>
              <div className={styles.userCell}>
                <div className={[styles.userAvatar, styles.avatarBlue].join(' ')}>{c.nombre.split(' ').slice(0,2).map(w=>w[0]).join('')}</div>
                <div className={styles.userName}>{c.nombre}</div>
              </div>
            </td>
            <td className={`${styles.td} ${styles.mono}`}>{c.cedula}</td>
            <td className={`${styles.td} ${styles.muted}`}>{c.telefono}</td>
            <td className={styles.td}><span className={styles.clampText}>{c.direccion}</span></td>
            <td className={styles.td}><Badge color={c.estado?'green':'gray'} dot>{c.estado?'Activo':'Inactivo'}</Badge></td>
            <td className={`${styles.td} ${styles.muted}`}>{fmtDate(c.fechaRegistro)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function TablaVentas({ rows }) {
  const total = rows.reduce((a,r)=>a+r.totalVentas,0)
  return (
    <table className={styles.table}>
      <thead><tr><th>Cliente</th><th>Cédula</th><th>N° Ventas</th><th>Total Ventas</th><th>Participación</th></tr></thead>
      <tbody>
        {rows.map(r=>{
          const pct = total>0?((r.totalVentas/total)*100).toFixed(1):0
          return (
            <tr key={r.cedula} className={styles.tr}>
              <td className={styles.td}>
                <div className={styles.userCell}>
                  <div className={[styles.userAvatar, styles.avatarAmber].join(' ')}>{r.nombre.split(' ').slice(0,2).map(w=>w[0]).join('')}</div>
                  <div className={styles.userName}>{r.nombre}</div>
                </div>
              </td>
              <td className={`${styles.td} ${styles.mono}`}>{r.cedula}</td>
              <td className={styles.td}><Badge color="blue">{r.cantidadVentas} venta{r.cantidadVentas!==1?'s':''}</Badge></td>
              <td className={styles.td}><span className={styles.totalVenta}>{fmtCurrency(r.totalVentas)}</span></td>
              <td className={styles.td} style={{minWidth:160}}>
                <div className={styles.progWrap}>
                  <div className={styles.progBar}><div className={styles.progFill} style={{width:`${pct}%`}}/></div>
                  <span className={styles.progPct}>{pct}%</span>
                </div>
              </td>
            </tr>
          )
        })}
      </tbody>
      <tfoot>
        <tr className={styles.tfootRow}>
          <td colSpan={3} className={styles.tfootLabel}>TOTAL GENERAL</td>
          <td className={`${styles.td} ${styles.totalVenta} ${styles.totalGrand}`}>{fmtCurrency(total)}</td>
          <td/>
        </tr>
      </tfoot>
    </table>
  )
}
