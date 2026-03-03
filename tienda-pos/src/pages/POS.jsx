import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth }     from '../context/AuthContext'
import { useSale }     from '../hooks/useSale'
import { guardarVenta } from '../services/saleService'
import { PageLayout }  from '../components/layout/PageLayout'
import ClientSearch    from '../components/pos/ClientSearch'
import ProductRow      from '../components/pos/ProductRow'
import TotalsPanel     from '../components/pos/TotalsPanel'
import ConfirmModal    from '../components/pos/ConfirmModal'
import { Button }      from '../components/ui/Button'
import { Icon }        from '../components/ui/Icons'
import styles from './POS.module.css'

const CONSECUTIVO_PREVIEW = '00248'

export default function POS() {
  const navigate  = useNavigate()
  const { user }  = useAuth()
  const sale      = useSale()

  const [cliente, setCliente]     = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving]       = useState(false)
  const [saveError, setSaveError] = useState('')

  const handleClienteConfirmado = (c) => setCliente(c)
  const handleClienteReset = () => { setCliente(null); sale.resetSale() }

  const handleAbrirModal = () => {
    if (!cliente) { alert('Primero debe seleccionar un cliente.'); return }
    setSaveError(''); setModalOpen(true)
  }

  const handleConfirmarVenta = async () => {
    setSaving(true); setSaveError('')
    try {
      const result = await guardarVenta({
        cliente, cajero: user, productos: sale.filasConProducto,
        subtotal: sale.totales.subtotal, totalIva: sale.totales.totalIva,
        totalConIva: sale.totales.totalConIva,
      })
      if (result.ok) {
        setModalOpen(false)
        navigate('/receipt', { state: {
          codigoVenta: result.codigoVenta, venta: result.venta,
          detalle: result.detalle, cliente, cajero: user,
          productos: sale.filasConProducto, totales: sale.totales,
        }})
      } else { setSaveError(result.message) }
    } finally { setSaving(false) }
  }

  const puedeConfirmar = sale.puedeConfirmar && !!cliente

  return (
    <PageLayout>
      <div className={styles.page}>
        {/* ── LEFT PANEL ── */}
        <div className={styles.leftPanel}>

          {/* Sección 1: Buscar cliente */}
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardHeaderLeft}>
                <span className={styles.sectionBadge}>1</span>
                <h2 className={styles.sectionTitle}>Buscar Cliente</h2>
              </div>
            </div>
            <div className={styles.cardBody}>
              <ClientSearch
                onClienteConfirmado={handleClienteConfirmado}
                clienteActual={cliente}
                onReset={handleClienteReset}
              />
            </div>
          </section>

          {/* Sección 2: Agregar Productos */}
          <section className={`${styles.card} ${!cliente ? styles.cardDisabled : ''}`}>
            <div className={styles.cardHeader}>
              <div className={styles.cardHeaderLeft}>
                <span className={styles.sectionBadge}>2</span>
                <div>
                  <h2 className={styles.sectionTitle}>Agregar Productos</h2>
                  <p className={styles.sectionSub}>Puedes agregar hasta 3 productos por venta</p>
                </div>
              </div>
            </div>
            <div className={styles.tableWrap}>
              <table className={styles.productTable}>
                <thead>
                  <tr>
                    <th className={styles.thNum}>#</th>
                    <th>Código</th>
                    <th>Nombre del Producto</th>
                    <th className={styles.thCenter}>Cantidad</th>
                    <th className={styles.thRight}>Precio Unit.</th>
                    <th className={styles.thRight}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {sale.filas.map((fila, i) => (
                    <ProductRow key={i} index={i} fila={fila}
                      habilitada={!!cliente && sale.isFilaHabilitada(i)}
                      onCodigoChange={sale.setCodigoFila}
                      onProductoEncontrado={sale.setProductoEncontrado}
                      onProductoNoEncontrado={sale.setProductoNoEncontrado}
                      onSearching={sale.setSearchingFila}
                      onCantidadChange={sale.setCantidadFila}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {!cliente && (
              <div className={styles.blockOverlayMsg}>
                <Icon name="arrow-left" size={15} strokeWidth={2} />
                Selecciona un cliente primero para agregar productos
              </div>
            )}

            <div className={styles.ctaRow}>
              {saveError && (
                <span className={styles.saveError}>
                  <Icon name="alert-circle" size={14} strokeWidth={2} /> {saveError}
                </span>
              )}
              <Button variant="primary" size="lg" disabled={!puedeConfirmar}
                onClick={handleAbrirModal}
                icon={<Icon name="check" size={16} strokeWidth={2.5} />}
                className={styles.ctaBtn}>
                Calcular y Confirmar Venta
              </Button>
            </div>
          </section>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className={styles.rightPanel}>
          <TotalsPanel cliente={cliente} filas={sale.filas}
            totales={sale.totales} consecutivoPreview={CONSECUTIVO_PREVIEW} />
        </div>
      </div>

      <ConfirmModal isOpen={modalOpen} onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmarVenta} loading={saving}
        cliente={cliente} filas={sale.filas} totales={sale.totales}
        consecutivoPreview={CONSECUTIVO_PREVIEW} />
    </PageLayout>
  )
}
