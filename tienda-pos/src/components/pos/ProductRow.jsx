import { useRef } from 'react'
import { buscarProductoPorCodigo } from '../../services/productService'
import { formatCurrency } from '../../utils/formatters'
import { Icon } from '../ui/Icons'
import styles from './ProductRow.module.css'

export default function ProductRow({ index, fila, habilitada,
  onCodigoChange, onProductoEncontrado, onProductoNoEncontrado, onSearching, onCantidadChange }) {
  const cantidadRef = useRef(null)

  const handleBuscarProducto = async () => {
    if (!fila.codigo.trim()) return
    onSearching(index)
    const result = await buscarProductoPorCodigo(fila.codigo.trim())
    if (result.ok) { onProductoEncontrado(index, result.producto); setTimeout(() => cantidadRef.current?.focus(), 100) }
    else           { onProductoNoEncontrado(index, result.message) }
  }

  const handleCodigoKeyDown = (e) => { if (e.key === 'Enter') handleBuscarProducto() }

  const rowClass = [
    styles.row,
    !habilitada              ? styles.disabled        : '',
    fila.status === 'valid'    ? styles.statusValid    : '',
    fila.status === 'invalid'  ? styles.statusInvalid  : '',
    fila.status === 'complete' ? styles.statusComplete : '',
    fila.status === 'searching'? styles.statusSearching: '',
  ].filter(Boolean).join(' ')

  return (
    <tr className={rowClass}>
      {/* # */}
      <td className={styles.cellNum}>
        <span className={[styles.numBadge, fila.status === 'complete' ? styles.numBadgeComplete : ''].join(' ')}>
          {fila.status === 'complete'
            ? <Icon name="check" size={12} strokeWidth={3} color="currentColor" />
            : index + 1}
        </span>
      </td>

      {/* Código + buscar */}
      <td className={styles.cellCodigo}>
        <div className={styles.codigoWrap}>
          <input type="text" inputMode="numeric"
            className={[styles.codigoInput, fila.status === 'invalid' ? styles.inputError : ''].join(' ')}
            placeholder="Cód." value={fila.codigo}
            onChange={e => onCodigoChange(index, e.target.value)}
            onKeyDown={handleCodigoKeyDown}
            disabled={!habilitada || fila.status === 'searching'}
            aria-label={`Código producto ${index + 1}`} />
          <button type="button" className={styles.searchIconBtn}
            onClick={handleBuscarProducto}
            disabled={!habilitada || !fila.codigo.trim() || fila.status === 'searching'}
            aria-label="Buscar producto">
            {fila.status === 'searching'
              ? <span className={styles.miniSpinner} />
              : <Icon name="search" size={14} strokeWidth={2} />}
          </button>
        </div>
      </td>

      {/* Nombre */}
      <td className={styles.cellNombre}>
        {fila.status === 'searching' && (
          <span className={`${styles.searchingText} animate-pulse`}>Buscando...</span>
        )}
        {fila.status === 'invalid' && (
          <span className={styles.errorText} title={fila.errorMsg}>
            <Icon name="x-circle" size={13} strokeWidth={2} /> {fila.errorMsg}
          </span>
        )}
        {(fila.status === 'valid' || fila.status === 'complete') && fila.producto && (
          <span className={styles.productName}>{fila.producto.nombre}</span>
        )}
        {fila.status === 'empty' && <span className={styles.placeholderText}>—</span>}
      </td>

      {/* Cantidad */}
      <td className={styles.cellCantidad}>
        <input ref={cantidadRef} type="number" min="1"
          className={[styles.cantidadInput, fila.status === 'complete' ? styles.cantidadComplete : ''].join(' ')}
          placeholder="0" value={fila.cantidad}
          onChange={e => onCantidadChange(index, e.target.value)}
          disabled={!habilitada || (fila.status !== 'valid' && fila.status !== 'complete')}
          aria-label={`Cantidad producto ${index + 1}`} />
      </td>

      {/* Precio unitario */}
      <td className={styles.cellPrecio}>
        <span className={[styles.monoValue, !fila.producto ? styles.emptyValue : ''].join(' ')}>
          {fila.producto ? formatCurrency(fila.producto.precioVenta) : '—'}
        </span>
      </td>

      {/* Total fila */}
      <td className={styles.cellTotal}>
        <span className={[styles.monoValue, styles.totalValue, fila.status === 'complete' ? styles.totalActive : ''].join(' ')}>
          {fila.status === 'complete' && fila.totalProducto > 0 ? formatCurrency(fila.totalProducto) : '—'}
        </span>
      </td>
    </tr>
  )
}
