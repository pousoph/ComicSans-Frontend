import { useCallback, useState } from 'react'
import { AdminLayout } from '../components/layout/AdminLayout'
import { CrudPage } from './CrudPage'
import { Btn, Input, Badge, Avatar } from '../components/ui'
import { Icon } from '../components/ui/Icons'
import { useCrud } from '../hooks/useCrud'
import { getClientes, createCliente, updateCliente, deleteCliente } from '../services/adminService'
import { fmtDate } from '../utils/formatters'

const EMPTY = { cedula:'', nombre:'', direccion:'', telefono:'', correo:'' }
const COLS  = ['Cliente', 'Cédula', 'Teléfono', 'Dirección', 'Estado', 'Registrado', 'Acciones']

export default function Clientes() {
  const crud = useCrud(useCallback(getClientes,[]))
  const [form, setForm]   = useState(EMPTY)
  const [errs, setErrs]   = useState({})
  const [saving, setSaving] = useState(false)

  const filtered = crud.data.filter(c =>
    [c.nombre,c.cedula,c.correo,c.telefono].some(v=>v?.toLowerCase().includes(crud.search.toLowerCase()))
  )

  const openCreate = () => { setForm(EMPTY); setErrs({}); crud.openCreate() }
  const openEdit   = c => { setForm({...c}); setErrs({}); crud.openEdit(c) }

  const validate = () => {
    const e = {}
    if (!form.cedula)    e.cedula    = 'Requerido'
    if (!form.nombre)    e.nombre    = 'Requerido'
    if (!form.direccion) e.direccion = 'Requerido'
    if (!form.telefono)  e.telefono  = 'Requerido'
    return e
  }

  const handleSave = async () => {
    const e = validate(); if (Object.keys(e).length) { setErrs(e); return }
    setSaving(true)
    const isEdit = crud.modal.mode === 'edit'
    const r = isEdit ? await updateCliente(crud.modal.item.id, form) : await createCliente(form)
    setSaving(false)
    if (r.ok) { crud.closeModal(); crud.reload(); crud.showToast(isEdit?'Cliente actualizado.':'Cliente creado.') }
    else      { crud.showToast(r.message,'error') }
  }

  const handleDelete = async () => {
    crud.setConfirmLoading(true)
    const r = await deleteCliente(crud.confirm.item.id)
    crud.setConfirmLoading(false)
    if (r.ok) { crud.closeConfirm(); crud.reload(); crud.showToast('Cliente eliminado.') }
    else      { crud.showToast(r.message,'error') }
  }

  const ch = e => { setForm(p=>({...p,[e.target.name]:e.target.value})); setErrs(p=>({...p,[e.target.name]:''})) }

  const modalContent = (
    <div style={{display:'flex',flexDirection:'column',gap:'var(--s-4)'}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'var(--s-3)'}}>
        <Input label="Cédula *" id="c-cedula" name="cedula" placeholder="Número de cédula"
          value={form.cedula} onChange={ch} error={errs.cedula} disabled={crud.modal.mode==='edit'}
          icon={<Icon name="id-card" size={14} color="var(--c-text-muted)" strokeWidth={1.75}/>}/>
        <Input label="Nombre completo *" id="c-nombre" name="nombre" placeholder="Nombre y apellidos"
          value={form.nombre} onChange={ch} error={errs.nombre}
          icon={<Icon name="user" size={14} color="var(--c-text-muted)" strokeWidth={1.75}/>}/>
      </div>
      <Input label="Dirección *" id="c-dir" name="direccion" placeholder="Calle, carrera, barrio..."
        value={form.direccion} onChange={ch} error={errs.direccion}
        icon={<Icon name="map-pin" size={14} color="var(--c-text-muted)" strokeWidth={1.75}/>}/>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'var(--s-3)'}}>
        <Input label="Teléfono *" id="c-tel" name="telefono" type="tel" placeholder="3001234567"
          value={form.telefono} onChange={ch} error={errs.telefono}
          icon={<Icon name="phone" size={14} color="var(--c-text-muted)" strokeWidth={1.75}/>}/>
        <Input label="Correo" id="c-correo" name="correo" type="email" placeholder="correo@email.com"
          value={form.correo} onChange={ch} error={errs.correo}
          icon={<Icon name="at-sign" size={14} color="var(--c-text-muted)" strokeWidth={1.75}/>}/>
      </div>
      <div style={{display:'flex',justifyContent:'flex-end',gap:'var(--s-3)',paddingTop:'var(--s-2)',borderTop:'1px solid var(--c-border)'}}>
        <Btn variant="ghost" onClick={crud.closeModal} disabled={saving}>Cancelar</Btn>
        <Btn variant="primary" loading={saving}
          icon={saving?undefined:<Icon name="check" size={15} strokeWidth={2.5}/>}
          onClick={handleSave}>
          {crud.modal.mode==='create'?'Crear Cliente':'Guardar Cambios'}
        </Btn>
      </div>
    </div>
  )

  const renderRow = c => (
    <tr key={c.id} className="tr">
      <td className="td">
        <div style={{display:'flex',alignItems:'center',gap:'var(--s-3)'}}>
          <Avatar name={c.nombre} size="sm" color="blue"/>
          <div style={{fontWeight:600,fontSize:'13.5px'}}>{c.nombre}</div>
        </div>
      </td>
      <td className="td td-mono">{c.cedula}</td>
      <td className="td td-muted">{c.telefono}</td>
      <td className="td" style={{maxWidth:200,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
        <span style={{fontSize:'13px',color:'var(--c-text-soft)'}}>{c.direccion}</span>
      </td>
      <td className="td"><Badge color={c.estado?'green':'gray'} dot>{c.estado?'Activo':'Inactivo'}</Badge></td>
      <td className="td td-muted">{fmtDate(c.fechaRegistro)}</td>
      <td className="td">
        <div className="td-actions">
          <Btn variant="outline" size="xs" icon={<Icon name="edit" size={12} strokeWidth={2}/>} onClick={()=>openEdit(c)}>Editar</Btn>
          <Btn variant="danger"  size="xs" icon={<Icon name="trash" size={12} strokeWidth={2}/>} onClick={()=>crud.openConfirm(c)}>Eliminar</Btn>
        </div>
      </td>
    </tr>
  )

  return (
    <AdminLayout>
      <CrudPage
        title="Clientes" sub="Gestiona los clientes registrados en la tienda"
        createLabel="Nuevo Cliente" columns={COLS} rows={filtered} loading={crud.loading}
        search={crud.search} onSearch={crud.setSearch} onCreateClick={openCreate}
        modal={crud.modal} onCloseModal={crud.closeModal} modalContent={modalContent}
        confirm={crud.confirm} onCloseConfirm={crud.closeConfirm} onConfirmDelete={handleDelete}
        toast={crud.toast} onCloseToast={()=>crud.showToast(null)} renderRow={renderRow}
      />
    </AdminLayout>
  )
}
