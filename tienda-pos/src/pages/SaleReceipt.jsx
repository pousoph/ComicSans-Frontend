import { useLocation, useNavigate } from 'react-router-dom'
import { PageLayout } from '../components/layout/PageLayout'
import { Button }     from '../components/ui/Button'
import { Icon }       from '../components/ui/Icons'
import { formatCurrency, formatConsecutivo, formatDate, formatTime } from '../utils/formatters'
import styles from './SaleReceipt.module.css'

export default function SaleReceipt() {
  const { state } = useLocation()
  const navigate  = useNavigate()

  if (!state?.codigoVenta) { navigate('/pos'); return null }

  const { codigoVenta, venta, cliente, cajero, productos, totales } = state

  return (
    <PageLayout>
      <div className={styles.page}>

        {/* ── Header éxito ── */}
        <div className={`${styles.successHeader} animate-fadeIn`}>
          <div className={styles.checkCircle}>
            <svg viewBox="0 0 52 52" className={styles.checkSvg}>
              <circle className={styles.checkCircleBg} cx="26" cy="26" r="24" />
              <path className={styles.checkMark} fill="none" d="M14 27 l9 9 l16-18" />
            </svg>
          </div>
          <div className={styles.successText}>
            <h1 className={styles.successTitle}>¡Venta Confirmada!</h1>
            <p className={styles.successSub}>La transacción fue registrada exitosamente en el sistema</p>
          </div>
        </div>

        {/* ── Línea de corte ── */}
        <div className={styles.cutLine}>
          <span className={styles.scissors}>
            <Icon name="scissors" size={18} color="var(--c-text-muted)" strokeWidth={1.75} />
          </span>
        </div>

        {/* ── RECEIPT CARD ── */}
        <div className={`${styles.receipt} animate-fadeIn delay-2`}>

          {/* Encabezado del comprobante */}
          <div className={styles.receiptHeader}>
            <div className={styles.receiptLogoWrap}>
              <Icon name="store" size={28} color="var(--c-primary)" strokeWidth={1.75} />
            </div>
            <h2 className={styles.receiptBrand}>Comic Sans</h2>
            <p className={styles.receiptSubBrand}>Punto de Venta — Comprobante de Venta</p>
            <div className={styles.receiptDivider} />
          </div>

          {/* Info de la venta */}
          <div className={styles.infoGrid}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>N° de Venta</span>
              <span className={`${styles.infoValue} ${styles.infoValueBig}`}>{formatConsecutivo(codigoVenta)}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Fecha</span>
              <span className={styles.infoValueMono}>{formatDate(venta?.fecha)}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Hora</span>
              <span className={styles.infoValueMono}>{formatTime(venta?.fecha)}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Cajero</span>
              <span className={styles.infoValue}>{cajero?.nombre}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Cliente</span>
              <span className={styles.infoValue}>{cliente?.nombre}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Cédula cliente</span>
              <span className={styles.infoValueMono}>{cliente?.cedula}</span>
            </div>
          </div>

          <div className={styles.dashedLine} />

          {/* Productos */}
          <div className={styles.productsSection}>
            <span className={styles.sectionCaps}>PRODUCTOS</span>
            <table className={styles.productTable}>
              <tbody>
                {productos.map((item, i) => (
                  <tr key={i} className={styles.productRow}>
                    <td className={styles.productName}>{item.producto.nombre}</td>
                    <td className={styles.productQty}>x{item.cantidad}</td>
                    <td className={styles.productPrice}>{formatCurrency(item.producto.precioVenta)}</td>
                    <td className={styles.productTotal}>{formatCurrency(item.totalProducto)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.dashedLine} />

          {/* Totales */}
          <div className={styles.totalsSection}>
            <div className={styles.totalRow}>
              <span>Subtotal:</span>
              <span className={styles.mono}>{formatCurrency(totales.subtotal)}</span>
            </div>
            <div className={styles.totalRow}>
              <span>IVA (19%):</span>
              <span className={styles.mono}>{formatCurrency(totales.totalIva)}</span>
            </div>
            <div className={styles.solidLine} />
            <div className={styles.totalRowBig}>
              <span>TOTAL PAGADO:</span>
              <span className={styles.totalBig}>{formatCurrency(totales.totalConIva)}</span>
            </div>
          </div>

          <div className={styles.dashedLine} />

          {/* Barcode */}
          <div className={styles.barcodeSection}>
            <p className={styles.barcodeNote}>Consecutivo generado automáticamente por el sistema</p>
            <div className={styles.barcode} aria-hidden="true">
              {Array.from({ length: 40 }, (_, i) => (
                <div key={i} className={styles.bar}
                  style={{ width: [1,2,1,3,1,2,1,1,2,3,1,2,1,1,3,2,1,1,2,1,3,1,2,1,2,3,1,1,2,1,3,2,1,1,2,1,3,1,2,1][i] + 'px' }} />
              ))}
            </div>
            <span className={styles.barcodeNum}>{formatConsecutivo(codigoVenta)}</span>
          </div>
        </div>

        {/* ── Acciones ── */}
        <div className={`${styles.actions} animate-fadeIn delay-3`}>
          <Button variant="outline-green" size="lg"
            icon={<Icon name="print" size={16} strokeWidth={2} />}
            onClick={() => window.print()}>
            Imprimir Comprobante
          </Button>
          <Button variant="primary" size="lg"
            icon={<Icon name="shopping-cart" size={16} strokeWidth={2} />}
            onClick={() => navigate('/pos')}>
            Nueva Venta
          </Button>
        </div>

        <p className={styles.footNote}>El comprobante también fue guardado en el sistema</p>
      </div>
    </PageLayout>
  )
}
