import { formatCurrency, formatConsecutivo } from '../../utils/formatters'
import { Button } from '../ui/Button'
import { Icon }   from '../ui/Icons'
import styles from './ConfirmModal.module.css'

export default function ConfirmModal({ isOpen, onClose, onConfirm, loading,
  cliente, filas, totales, consecutivoPreview }) {
  if (!isOpen) return null
  const filasCompletas = filas.filter(f => f.status === 'complete' && f.producto)

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={`${styles.modal} animate-fadeInScale`}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIconWrap}>
              <Icon name="receipt" size={20} color="var(--c-primary)" strokeWidth={1.75} />
            </div>
            <h2 className={styles.headerTitle}>
              Confirmar Venta {formatConsecutivo(consecutivoPreview)}
            </h2>
          </div>
          <button className={styles.closeBtn} onClick={onClose} disabled={loading}
            type="button" aria-label="Cerrar">
            <Icon name="x" size={15} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {/* Cliente */}
          <div className={styles.section}>
            <span className={styles.sectionLabel}>CLIENTE</span>
            <div className={styles.clienteCard}>
              <div className={styles.clienteIconWrap}>
                <Icon name="user" size={18} color="var(--c-primary)" strokeWidth={1.75} />
              </div>
              <div>
                <div className={styles.clienteName}>{cliente?.nombre}</div>
                <div className={styles.clienteCedula}>{cliente?.cedula}</div>
              </div>
            </div>
          </div>

          {/* Productos */}
          <div className={styles.section}>
            <span className={styles.sectionLabel}>PRODUCTOS</span>
            <table className={styles.productTable}>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th className={styles.right}>Cant.</th>
                  <th className={styles.right}>P. Unit.</th>
                  <th className={styles.right}>Total</th>
                </tr>
              </thead>
              <tbody>
                {filasCompletas.map((f, i) => (
                  <tr key={i}>
                    <td>{f.producto.nombre}</td>
                    <td className={styles.right}>x{f.cantidad}</td>
                    <td className={`${styles.right} ${styles.mono}`}>{formatCurrency(f.producto.precioVenta)}</td>
                    <td className={`${styles.right} ${styles.mono} ${styles.bold}`}>{formatCurrency(f.totalProducto)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totales */}
          <div className={styles.section}>
            <div className={styles.totalsBlock}>
              <div className={styles.totalRow}>
                <span>Subtotal:</span>
                <span className={styles.mono}>{formatCurrency(totales.subtotal)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>IVA (19%):</span>
                <span className={styles.mono}>{formatCurrency(totales.totalIva)}</span>
              </div>
              <div className={styles.totalDivider} />
              <div className={styles.totalRowBig}>
                <span>Total a pagar:</span>
                <span className={styles.totalBig}>{formatCurrency(totales.totalConIva)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <Button variant="outline-red" size="md" onClick={onClose} disabled={loading}
            icon={<Icon name="x" size={14} strokeWidth={2.5} />}>
            Cancelar
          </Button>
          <Button variant="primary" size="md" onClick={onConfirm} loading={loading}
            icon={!loading ? <Icon name="check" size={15} strokeWidth={2.5} /> : undefined}>
            Confirmar y Guardar
          </Button>
        </div>
      </div>
    </div>
  )
}
