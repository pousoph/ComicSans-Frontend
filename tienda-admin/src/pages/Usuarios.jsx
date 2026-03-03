import { useState, useCallback } from 'react'
import { AdminLayout } from '../components/layout/AdminLayout'
import { CrudPage } from './CrudPage'
import { Btn, Input, Select, Badge, Avatar } from '../components/ui'
import { Icon } from '../components/ui/Icons'
import { useCrud } from '../hooks/useCrud'
import { getUsuarios, createUsuario, updateUsuario, deleteUsuario, toggleUsuarioEstado } from '../services/adminService'
import { fmtDate, rolLabel } from '../utils/formatters'

const EMPTY = { cedula:'', nombre:'', correo:'', usuario:'', password:'', rol:'CAJERO' }
const COLS  = ['Usuario', 'Cédula', 'Correo', 'Rol', 'Estado', 'Creado', 'Acciones']

export default function Usuarios() {
  const crud = useCrud(useCallback(getUsuarios,[]))
  const [form, setForm]   = useState(EMPTY)
  const [errs, setErrs]   = useState({})
  const [saving, setSaving] = useState(false)
  const [showPwd, setShowPwd] = useState(false)

  const filtered = crud.data.filter(u =>
    [u.nombre,u.cedula,u.correo,u.usuario].some(v=>v?.toLowerCase().includes(crud.search.toLowerCase()))
  )

  const openCreate = () => { setForm(EMPTY); setErrs({}); crud.openCreate() }
  const openEdit   = u => { setForm({...u, password:''}); setErrs({}); crud.openEdit(u) }

  const validate = () => {
    const e = {}
    if (!form.cedula)  e.cedula  = 'Requerido'
    if (!form.nombre)  e.nombre  = 'Requerido'
    if (!form.correo)  e.correo  = 'Requerido'
    if (!form.usuario) e.usuario = 'Requerido'
    if (crud.modal.mode==='create' && !form.password) e.password = 'Requerido'
    return e
  }

  const handleSave = async () => {
    const e = validate(); if (Object.keys(e).length) { setErrs(e); return }
    setSaving(true)
    const isEdit = crud.modal.mode === 'edit'
    const r = isEdit ? await updateUsuario(crud.modal.item.id, form) : await createUsuario(form)
    setSaving(false)
    if (r.ok) { crud.closeModal(); crud.reload(); crud.showToast(isEdit?'Usuario actualizado.':'Usuario creado.') }
    else      { crud.showToast(r.message, 'error') }
  }

  const handleDelete = async () => {
    crud.setConfirmLoading(true)
    const r = await deleteUsuario(crud.confirm.item.id)
    crud.setConfirmLoading(false)
    if (r.ok) { crud.closeConfirm(); crud.reload(); crud.showToast('Usuario eliminado.') }
    else      { crud.showToast(r.message,'error') }
  }

  const handleToggle = async u => {
    const r = await toggleUsuarioEstado(u.id)
    if (r.ok) { crud.reload(); crud.showToast(`Usuario ${r.data.estado?'activado':'desactivado'}.`) }
  }

  const ch = e => { setForm(p=>({...p,[e.target.name]:e.target.value})); setErrs(p=>({...p,[e.target.name]:''})) }

  const modalContent = (
    <div style={{display:'flex',flexDirection:'column',gap:'var(--s-4)'}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'var(--s-3)'}}>
        <Input label="Cédula *" id="u-cedula" name="cedula" placeholder="Número de cédula"
          value={form.cedula} onChange={ch} error={errs.cedula}
          icon={<Icon name="id-card" size={14} color="var(--c-text-muted)" strokeWidth={1.75}/>}
          disabled={crud.modal.mode==='edit'}/>
        <Input label="Nombre completo *" id="u-nombre" name="nombre" placeholder="Nombre y apellidos"
          value={form.nombre} onChange={ch} error={errs.nombre}
          icon={<Icon name="user" size={14} color="var(--c-text-muted)" strokeWidth={1.75}/>}/>
      </div>
      <Input label="Correo electrónico *" id="u-correo" name="correo" type="email" placeholder="correo@comicsans.com"
        value={form.correo} onChange={ch} error={errs.correo}
        icon={<Icon name="at-sign" size={14} color="var(--c-text-muted)" strokeWidth={1.75}/>}/>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'var(--s-3)'}}>
        <Input label="Nombre de usuario *" id="u-usuario" name="usuario" placeholder="username"
          value={form.usuario} onChange={ch} error={errs.usuario}
          icon={<Icon name="user" size={14} color="var(--c-text-muted)" strokeWidth={1.75}/>}/>
        <Input label={crud.modal.mode==='create'?'Contraseña *':'Nueva contraseña'} id="u-pwd" name="password"
          type={showPwd?'text':'password'} placeholder={crud.modal.mode==='edit'?'Dejar vacío para no cambiar':'Contraseña'}
          value={form.password} onChange={ch} error={errs.password}
          icon={<Icon name="lock" size={14} color="var(--c-text-muted)" strokeWidth={1.75}/>}
          iconRight={<Icon name={showPwd?'eye-off':'eye'} size={14} color="var(--c-text-muted)" strokeWidth={1.75}/>}
          onIconRightClick={()=>setShowPwd(v=>!v)}/>
      </div>
      <Select label="Rol *" id="u-rol" name="rol" value={form.rol} onChange={ch}>
        <option value="CAJERO">Cajero</option>
        <option value="ADMIN">Administrador</option>
      </Select>
      <div style={{display:'flex',justifyContent:'flex-end',gap:'var(--s-3)',paddingTop:'var(--s-2)',borderTop:'1px solid var(--c-border)'}}>
        <Btn variant="ghost" onClick={crud.closeModal} disabled={saving}>Cancelar</Btn>
        <Btn variant="primary" loading={saving}
          icon={saving?undefined:<Icon name="check" size={15} strokeWidth={2.5}/>}
          onClick={handleSave}>
          {crud.modal.mode==='create'?'Crear Usuario':'Guardar Cambios'}
        </Btn>
      </div>
    </div>
  )

  const renderRow = u => (
    <tr key={u.id} className="tr">
      <td className="td">
        <div style={{display:'flex',alignItems:'center',gap:'var(--s-3)'}}>
          <Avatar name={u.nombre} size="sm" color={u.rol==='ADMIN'?'purple':'green'}/>
          <div>
            <div style={{fontWeight:600,fontSize:'13.5px'}}>{u.nombre}</div>
            <div style={{fontSize:'12px',color:'var(--c-text-muted)'}}>{u.usuario}</div>
          </div>
        </div>
      </td>
      <td className="td td-mono">{u.cedula}</td>
      <td className="td td-muted">{u.correo}</td>
      <td className="td"><Badge color={u.rol==='ADMIN'?'purple':'blue'}>{rolLabel(u.rol)}</Badge></td>
      <td className="td">
        <button onClick={()=>handleToggle(u)} style={{background:'none',border:'none',cursor:'pointer'}}>
          <Badge color={u.estado?'green':'gray'} dot>{u.estado?'Activo':'Inactivo'}</Badge>
        </button>
      </td>
      <td className="td td-muted">{fmtDate(u.fechaCreacion)}</td>
      <td className="td">
        <div className="td-actions">
          <Btn variant="outline" size="xs" icon={<Icon name="edit" size={12} strokeWidth={2}/>} onClick={()=>openEdit(u)}>Editar</Btn>
          <Btn variant="danger"  size="xs" icon={<Icon name="trash" size={12} strokeWidth={2}/>} onClick={()=>crud.openConfirm(u)}>Eliminar</Btn>
        </div>
      </td>
    </tr>
  )

  return (
    <AdminLayout>
      <CrudPage
        title="Usuarios" sub="Gestiona los usuarios del sistema (cajeros y administradores)"
        createLabel="Nuevo Usuario" columns={COLS} rows={filtered} loading={crud.loading}
        search={crud.search} onSearch={crud.setSearch} onCreateClick={openCreate}
        modal={crud.modal} onCloseModal={crud.closeModal} modalContent={modalContent}
        confirm={crud.confirm} onCloseConfirm={crud.closeConfirm} onConfirmDelete={handleDelete}
        toast={crud.toast} onCloseToast={()=>crud.showToast(null)} renderRow={renderRow}
      />
    </AdminLayout>
  )
}
