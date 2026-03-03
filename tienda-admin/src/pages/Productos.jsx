import { useState, useRef } from 'react'
import { AdminLayout } from '../components/layout/AdminLayout'
import { Btn, Toast } from '../components/ui'
import { Icon } from '../components/ui/Icons'
import { cargarProductosCSV } from '../services/adminService'
import { MOCK_PRODUCTOS } from '../services/mockData'
import { fmtCurrency } from '../utils/formatters'
import styles from './Productos.module.css'

export default function Productos() {
  const fileRef = useRef()
  const [file, setFile]       = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult]   = useState(null)
  const [toast, setToast]     = useState(null)
  const [productos, setProductos] = useState([...MOCK_PRODUCTOS])
  const [drag, setDrag]       = useState(false)

  const handleFile = e => {
    const f = e.target.files[0]
    if (!f) return
    if (!f.name.endsWith('.csv')) { setToast({message:'Solo se aceptan archivos .csv',type:'error'}); return }
    setFile(f); setResult(null)
  }

  const handleDrop = e => {
    e.preventDefault(); setDrag(false)
    const f = e.dataTransfer.files[0]
    if (f) { setFile(f); setResult(null) }
  }

  const handleCargar = async () => {
    if (!file) { setToast({message:'Selecciona un archivo primero.',type:'warning'}); return }
    setLoading(true)
    const r = await cargarProductosCSV(file)
    setLoading(false)
    setResult(r)
    if (r.ok) {
      setProductos([...MOCK_PRODUCTOS])
      setToast({message:r.message,type:'success'})
      setFile(null)
      if (fileRef.current) fileRef.current.value = ''
    } else { setToast({message:r.message,type:'error'}) }
  }

  const handleReset = () => { setFile(null); setResult(null); if (fileRef.current) fileRef.current.value = '' }

  return (
    <AdminLayout>
      <div className={styles.page}>
        {toast && <Toast message={toast.message} type={toast.type} onClose={()=>setToast(null)}/>}

        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Gestión de Productos</h1>
            <p className={styles.sub}>Carga masiva de productos mediante archivo CSV</p>
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.uploadCard}>
            <div className={styles.uploadHeader}>
              <div className={styles.uploadIconWrap}>
                <Icon name="package" size={22} color="var(--c-primary)" strokeWidth={1.5}/>
              </div>
              <div>
                <h3 className={styles.uploadTitle}>Cargar Archivo CSV</h3>
                <p className={styles.uploadSub}>El archivo reemplazará todos los productos existentes</p>
              </div>
            </div>

            <div className={[styles.dropZone, file?styles.dropZoneActive:'', drag?styles.dropZoneDrag:''].join(' ')}
              onDrop={handleDrop}
              onDragOver={e=>{e.preventDefault();setDrag(true)}}
              onDragLeave={()=>setDrag(false)}
              onClick={()=>fileRef.current?.click()}>
              <input ref={fileRef} type="file" accept=".csv" className={styles.fileInput} onChange={handleFile}/>
              {file ? (
                <div className={styles.fileSelected}>
                  <Icon name="file-csv" size={28} color="var(--c-primary)" strokeWidth={1.5}/>
                  <div>
                    <div className={styles.fileName}>{file.name}</div>
                    <div className={styles.fileSize}>{(file.size/1024).toFixed(1)} KB — listo para cargar</div>
                  </div>
                  <button className={styles.fileRemove} onClick={e=>{e.stopPropagation();handleReset()}}>
                    <Icon name="x" size={12} strokeWidth={2.5}/>
                  </button>
                </div>
              ) : (
                <div className={styles.dropContent}>
                  <div className={styles.dropIconWrap}>
                    <Icon name="upload" size={28} color="var(--c-text-muted)" strokeWidth={1.25}/>
                  </div>
                  <p className={styles.dropText}>Arrastra tu archivo CSV aquí</p>
                  <p className={styles.dropSub}>o haz clic para seleccionar</p>
                  <span className={styles.dropBadge}>.csv únicamente</span>
                </div>
              )}
            </div>

            <div className={styles.formatCard}>
              <h4 className={styles.formatTitle}>
                <Icon name="file-text" size={13} color="var(--c-text-soft)" strokeWidth={2}/>
                Formato requerido del CSV
              </h4>
              <div className={styles.formatTable}>
                {[
                  ['codigo_producto', 'BIGINT',       'Código único del producto'],
                  ['nombre_producto', 'VARCHAR(50)',   'Nombre del producto'],
                  ['nitproveedor',    'BIGINT',        'NIT del proveedor (debe existir)'],
                  ['precio_compra',   'DOUBLE',        'Precio de compra'],
                  ['ivacompra',       'DOUBLE',        'Porcentaje de IVA (ej: 19)'],
                  ['precio_venta',    'DOUBLE',        'Precio de venta con IVA'],
                ].map(([f,t,d]) => (
                  <div key={f} className={styles.formatRow}>
                    <span className={styles.formatField}>{f}</span>
                    <span className={styles.formatType}>{t}</span>
                    <span className={styles.formatDesc}>{d}</span>
                  </div>
                ))}
              </div>
              <div className={styles.exampleBox}>
                <span className={styles.exampleLabel}>Ejemplo:</span>
                <code className={styles.exampleCode}>1,Melocotones,1,25505,19,30351</code>
              </div>
            </div>

            {result && !result.ok && result.errores && (
              <div className={styles.errorList}>
                <h4 className={styles.errorListTitle}>
                  <Icon name="alert-circle" size={14} strokeWidth={2}/>
                  {result.errores.length} errores encontrados
                </h4>
                {result.errores.map((e,i)=>(
                  <div key={i} className={styles.errorItem}>
                    <Icon name="x-circle" size={12} strokeWidth={2}/> {e}
                  </div>
                ))}
              </div>
            )}

            <div className={styles.uploadActions}>
              <Btn variant="ghost" onClick={handleReset} disabled={!file||loading}>
                <Icon name="refresh" size={14} strokeWidth={2}/> Limpiar
              </Btn>
              <Btn variant="primary" size="md" loading={loading} onClick={handleCargar} disabled={!file}
                icon={loading?undefined:<Icon name="upload" size={15} strokeWidth={2}/>}>
                Cargar y Reemplazar Productos
              </Btn>
            </div>
          </div>

          <div className={styles.tableCard}>
            <div className={styles.tableHeader}>
              <h3 className={styles.tableTitle}>
                <Icon name="list" size={16} color="var(--c-primary)" strokeWidth={2}/>
                Productos Actuales
              </h3>
              <span className={styles.tableCount}>{productos.length} productos</span>
            </div>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr><th>Cód.</th><th>Nombre</th><th>NIT Prov.</th><th>P. Compra</th><th>IVA</th><th>P. Venta</th></tr>
                </thead>
                <tbody>
                  {productos.map(p=>(
                    <tr key={p.codigo} className={styles.tableRow}>
                      <td className={styles.tdCode}>{p.codigo}</td>
                      <td className={styles.tdName}>{p.nombre}</td>
                      <td className={styles.tdMono}>{p.nitProveedor}</td>
                      <td className={styles.tdMono}>{fmtCurrency(p.precioCompra)}</td>
                      <td><span className={styles.ivaBadge}>{p.ivaCompra}%</span></td>
                      <td className={styles.tdPrice}>{fmtCurrency(p.precioVenta)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
