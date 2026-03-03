import { useCallback, useState } from 'react'
import { AdminLayout } from '../components/layout/AdminLayout'
import { CrudPage } from './CrudPage'
import { Btn, Input, Badge } from '../components/ui'
import { Icon } from '../components/ui/Icons'
import { useCrud } from '../hooks/useCrud'
import { getProveedores, createProveedor, updateProveedor, deleteProveedor } from '../services/adminService'

const EMPTY = { nit:'', nombre:'', direccion:'', telefono:'', ciudad:'' }
const COLS  = ['Proveedor', 'NIT', 'Ciudad', 'Teléfono', 'Dirección', 'Acciones']

export default function Proveedores() {
  const crud = useCrud(useCallback(getProveedores,[]))
  const [form, setForm]   = useState(EMPTY)
  const [errs, setErrs]   = useState({})
  const [saving, setSaving] = useState(false)

  const filtered = crud.data.filter(p =>
    [p.nombre,p.nit,p.ciudad].some(v=>v?.toLowerCase().includes(crud.search.toLowerCase()))
  )

  const openCreate = () => { setForm(EMPTY); setErrs({}); crud.openCreate() }
  const openEdit   = p => { setForm({...p}); setErrs({}); crud.openEdit(p) }

  const validate = () => {
    const e = {}
    if (!form.nit)       e.nit       = 'Requerido'
    if (!form.nombre)    e.nombre    = 'Requerido'
    if (!form.direccion) e.direccion = 'Requerido'
    if (!form.telefono)  e.telefono  = 'Requerido'
    if (!form.ciudad)    e.ciudad    = 'Requerido'
    return e
  }

  const handleSave = async () => {
    const e = validate(); if (Object.keys(e).length) { setErrs(e); return }
    setSaving(true)
    const isEdit = crud.modal.mode === 'edit'
    const r = isEdit ? await updateProveedor(crud.modal.item.id, form) : await createProveedor(form)
    setSaving(false)
    if (r.ok) { crud.closeModal(); crud.reload(); crud.showToast(isEdit?'Proveedor actualizado.':'Proveedor creado.') }
    else      { crud.showToast(r.message,'error') }
  }

  const handleDelete = async () => {
    crud.setConfirmLoading(true)
    const r = await deleteProveedor(crud.confirm.item.id)
    crud.setConfirmLoading(false)
    if (r.ok) { crud.closeConfirm(); crud.reload(); crud.showToast('Proveedor eliminado.') }
    else      { crud.showToast(r.message,'error') }
  }

  const ch = e => { setForm(p=>({...p,[e.target.name]:e.target.value})); setErrs(p=>({...p,[e.target.name]:''})) }

  const modalContent = (
    <div style={{display:'flex',flexDirection:'column',gap:'var(--s-4)'}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'var(--s-3)'}}>
        <Input label="NIT *" id="p-nit" name="nit" placeholder="NIT del proveedor"
          value={form.nit} onChange={ch} error={errs.nit} disabled={crud.modal.mode==='edit'}
          icon={<Icon name="tag" size={14} color="var(--c-text-muted)" strokeWidth={1.75}/>}/>
        <Input label="Nombre proveedor *" id="p-nombre" name="nombre" placeholder="Razón social"
          value={form.nombre} onChange={ch} error={errs.nombre}
          icon={<Icon name="building" size={14} color="var(--c-text-muted)" strokeWidth={1.75}/>}/>
      </div>
      <Input label="Dirección *" id="p-dir" name="direccion" placeholder="Dirección de la empresa"
        value={form.direccion} onChange={ch} error={errs.direccion}
        icon={<Icon name="map-pin" size={14} color="var(--c-text-muted)" strokeWidth={1.75}/>}/>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'var(--s-3)'}}>
        <Input label="Teléfono *" id="p-tel" name="telefono" placeholder="Ej: 6011234567"
          value={form.telefono} onChange={ch} error={errs.telefono}
          icon={<Icon name="phone" size={14} color="var(--c-text-muted)" strokeWidth={1.75}/>}/>
        <Input label="Ciudad *" id="p-ciudad" name="ciudad" placeholder="Bogotá, Medellín..."
          value={form.ciudad} onChange={ch} error={errs.ciudad}
          icon={<Icon name="map-pin" size={14} color="var(--c-text-muted)" strokeWidth={1.75}/>}/>
      </div>
      <div style={{display:'flex',justifyContent:'flex-end',gap:'var(--s-3)',paddingTop:'var(--s-2)',borderTop:'1px solid var(--c-border)'}}>
        <Btn variant="ghost" onClick={crud.closeModal} disabled={saving}>Cancelar</Btn>
        <Btn variant="primary" loading={saving}
          icon={saving?undefined:<Icon name="check" size={15} strokeWidth={2.5}/>}
          onClick={handleSave}>
          {crud.modal.mode==='create'?'Crear Proveedor':'Guardar Cambios'}
        </Btn>
      </div>
    </div>
  )

  const renderRow = p => (
    <tr key={p.id} className="tr">
      <td className="td">
        <div style={{display:'flex',alignItems:'center',gap:'var(--s-3)'}}>
          <div style={{width:34,height:34,borderRadius:'var(--r-sm)',background:'var(--c-surface-2)',border:'1.5px solid var(--c-border-dark)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            <Icon name="building" size={16} color="var(--c-primary)" strokeWidth={1.75}/>
          </div>
          <div style={{fontWeight:600,fontSize:'13.5px'}}>{p.nombre}</div>
        </div>
      </td>
      <td className="td td-mono">{p.nit}</td>
      <td className="td"><Badge color="blue">{p.ciudad}</Badge></td>
      <td className="td td-muted">{p.telefono}</td>
      <td className="td" style={{maxWidth:180,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
        <span style={{fontSize:'12.5px',color:'var(--c-text-soft)'}}>{p.direccion}</span>
      </td>
      <td className="td">
        <div className="td-actions">
          <Btn variant="outline" size="xs" icon={<Icon name="edit" size={12} strokeWidth={2}/>} onClick={()=>openEdit(p)}>Editar</Btn>
          <Btn variant="danger"  size="xs" icon={<Icon name="trash" size={12} strokeWidth={2}/>} onClick={()=>crud.openConfirm(p)}>Eliminar</Btn>
        </div>
      </td>
    </tr>
  )

  return (
    <AdminLayout>
      <CrudPage
        title="Proveedores" sub="Gestiona los proveedores que abastecen la tienda"
        createLabel="Nuevo Proveedor" columns={COLS} rows={filtered} loading={crud.loading}
        search={crud.search} onSearch={crud.setSearch} onCreateClick={openCreate}
        modal={crud.modal} onCloseModal={crud.closeModal} modalContent={modalContent}
        confirm={crud.confirm} onCloseConfirm={crud.closeConfirm} onConfirmDelete={handleDelete}
        toast={crud.toast} onCloseToast={()=>crud.showToast(null)} renderRow={renderRow}
      />
    </AdminLayout>
  )
}
