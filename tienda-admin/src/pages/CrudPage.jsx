import { Btn, SearchBar, Modal, Confirm, Toast, EmptyState } from '../components/ui'
import { Icon } from '../components/ui/Icons'
import styles from './CrudPage.module.css'

export function CrudPage({ title, sub, createLabel, columns, rows, loading,
  search, onSearch, onCreateClick, modal, onCloseModal, modalContent,
  confirm, onCloseConfirm, onConfirmDelete, toast, onCloseToast, renderRow }) {
  return (
    <div className={styles.page}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={onCloseToast}/>}

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.sub}>{sub}</p>
        </div>
        <Btn variant="primary" size="md"
          icon={<Icon name="plus" size={16} strokeWidth={2.5}/>}
          onClick={onCreateClick}>
          {createLabel}
        </Btn>
      </div>

      <div className={styles.card}>
        <div className={styles.tableTop}>
          <SearchBar value={search} onChange={e=>onSearch(e.target.value)} placeholder={`Buscar en ${title.toLowerCase()}...`}/>
          <span className={styles.count}>{rows.length} registro{rows.length!==1?'s':''}</span>
        </div>

        {loading ? (
          <div className={styles.skelWrap}>{[1,2,3,4,5].map(i=><div key={i} className={styles.skelRow}/>)}</div>
        ) : rows.length === 0 ? (
          <EmptyState icon="search" title="Sin resultados" message="No se encontraron registros con ese criterio."/>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>{columns.map(c=><th key={c} className={styles.th}>{c}</th>)}</tr>
              </thead>
              <tbody>{rows.map((row,i)=>renderRow(row,i))}</tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={modal.open} onClose={onCloseModal}
        title={`${modal.mode==='create'?'Crear':'Editar'} ${title.replace(/s$/,'')}`}
        width="560px">
        {modalContent}
      </Modal>

      <Confirm isOpen={confirm.open} onClose={onCloseConfirm} onConfirm={onConfirmDelete}
        loading={confirm.loading} title="¿Eliminar registro?"
        message="Esta acción no se puede deshacer. El registro será eliminado permanentemente."/>
    </div>
  )
}
