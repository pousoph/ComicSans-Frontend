import { formatCurrency, formatConsecutivo } from '../../utils/formatters'
import { StatusBadge } from '../ui/StatusBadge'
import { Icon } from '../ui/Icons'
import styles from './TotalsPanel.module.css'

export default function TotalsPanel({ cliente, filas, totales, consecutivoPreview }) {
  const filasConProducto = filas.filter(f => f.status === 'complete' && f.producto)
  const hayDatos = filasConProducto.length > 0

  return (
    <aside className={styles.panel}>
      <div className={styles.header}>
        <h3 className={styles.title}>Resumen de Venta</h3>
        <StatusBadge variant={hayDatos ? 'loading' : 'neutral'}>
          {hayDatos ? 'En proceso' : 'Sin productos'}
        </StatusBadge>
      </div>

      <div className={styles.consecutivo}>
        <span className={styles.consecutivoLabel}>N° de Venta</span>
        <span className={styles.consecutivoNum}>{formatConsecutivo(consecutivoPreview)}</span>
        <StatusBadge variant="neutral">Pendiente de confirmar</StatusBadge>
      </div>

      <div className={styles.productsList}>
        {!hayDatos ? (
          <p className={styles.emptyProducts}>Aún no has agregado productos</p>
        ) : (
          filasConProducto.map((f, i) => (
            <div key={i} className={styles.productItem}>
              <div className={styles.productItemLeft}>
                <span className={styles.productItemIconWrap}>
                  <Icon name="package" size={13} color="var(--c-primary)" strokeWidth={2} />
                </span>
                <span className={styles.productItemName}>
                  {f.producto.nombre}
                  <span className={styles.productItemQty}>x{f.cantidad}</span>
                </span>
              </div>
              <span className={styles.productItemTotal}>{formatCurrency(f.totalProducto)}</span>
            </div>
          ))
        )}
      </div>

      <div className={styles.divider} />

      <div className={styles.totals}>
        <div className={styles.totalRow}>
          <span className={styles.totalLabel}>Subtotal (sin IVA)</span>
          <span className={styles.totalValue}>{formatCurrency(totales.subtotal)}</span>
        </div>
        <div className={styles.totalRow}>
          <span className={styles.totalLabel}>IVA (19%)</span>
          <span className={styles.totalValue}>{formatCurrency(totales.totalIva)}</span>
        </div>
        <div className={styles.totalDivider} />
        <div className={styles.totalRowBig}>
          <span className={styles.totalLabelBig}>TOTAL CON IVA</span>
          <span className={styles.totalValueBig}>{formatCurrency(totales.totalConIva)}</span>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.clienteBlock}>
        <span className={styles.clienteLabel}>Cliente</span>
        {cliente ? (
          <div className={styles.clienteInfo}>
            <span className={styles.clienteName}>{cliente.nombre}</span>
            <span className={styles.clienteCedula}>{cliente.cedula}</span>
          </div>
        ) : (
          <span className={styles.clienteEmpty}>Sin asignar</span>
        )}
      </div>
    </aside>
  )
}
