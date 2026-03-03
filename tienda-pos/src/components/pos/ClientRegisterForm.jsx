import { useState } from 'react'
import { registrarCliente } from '../../services/clientService'
import { Button } from '../ui/Button'
import { Input }  from '../ui/Input'
import { Icon }   from '../ui/Icons'
import styles from './ClientRegisterForm.module.css'

export default function ClientRegisterForm({ cedulaInicial = '', onExito, onCancelar }) {
  const [form, setForm]       = useState({ cedula: cedulaInicial, nombre: '', direccion: '', telefono: '', correo: '' })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
    setApiError('')
  }

  const validate = () => {
    const errs = {}
    if (!form.cedula.trim())    errs.cedula    = 'La cédula es requerida.'
    if (!form.nombre.trim())    errs.nombre    = 'El nombre es requerido.'
    if (!form.direccion.trim()) errs.direccion = 'La dirección es requerida.'
    if (!form.telefono.trim())  errs.telefono  = 'El teléfono es requerido.'
    if (!form.correo.trim())    errs.correo    = 'El correo es requerido.'
    else if (!/\S+@\S+\.\S+/.test(form.correo)) errs.correo = 'Correo inválido.'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true); setApiError('')
    try {
      const result = await registrarCliente(form)
      if (result.ok) onExito(result.cliente)
      else           setApiError(result.message)
    } finally { setLoading(false) }
  }

  return (
    <div className={`${styles.wrapper} animate-fadeInScale`}>
      <div className={styles.header}>
        <div className={styles.headerIconWrap}>
          <Icon name="user-plus" size={18} color="var(--c-primary)" strokeWidth={1.75} />
        </div>
        <div>
          <h4 className={styles.headerTitle}>Registrar nuevo cliente</h4>
          <p className={styles.headerSub}>Complete los datos para continuar con la venta</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className={styles.form}>
        <div className={styles.grid2}>
          <Input label="Cédula *" id="reg-cedula" name="cedula" type="text" inputMode="numeric"
            placeholder="Número de cédula" value={form.cedula} onChange={handleChange}
            error={errors.cedula} style={{ fontFamily: 'var(--font-mono)' }}
            icon={<Icon name="id-card" size={14} color="var(--c-text-muted)" strokeWidth={1.75} />} />
          <Input label="Nombre completo *" id="reg-nombre" name="nombre" type="text"
            placeholder="Nombre y apellidos" value={form.nombre} onChange={handleChange}
            error={errors.nombre}
            icon={<Icon name="user" size={14} color="var(--c-text-muted)" strokeWidth={1.75} />} />
        </div>
        <Input label="Dirección *" id="reg-direccion" name="direccion" type="text"
          placeholder="Calle, carrera, barrio..." value={form.direccion} onChange={handleChange}
          error={errors.direccion}
          icon={<Icon name="map-pin" size={14} color="var(--c-text-muted)" strokeWidth={1.75} />} />
        <div className={styles.grid2}>
          <Input label="Teléfono *" id="reg-telefono" name="telefono" type="tel" inputMode="numeric"
            placeholder="Ej: 3001234567" value={form.telefono} onChange={handleChange}
            error={errors.telefono}
            icon={<Icon name="phone" size={14} color="var(--c-text-muted)" strokeWidth={1.75} />} />
          <Input label="Correo electrónico *" id="reg-correo" name="correo" type="email"
            placeholder="correo@ejemplo.com" value={form.correo} onChange={handleChange}
            error={errors.correo}
            icon={<Icon name="at-sign" size={14} color="var(--c-text-muted)" strokeWidth={1.75} />} />
        </div>

        {apiError && (
          <div className={styles.apiError} role="alert">
            <Icon name="alert-circle" size={14} strokeWidth={2} /> {apiError}
          </div>
        )}

        <div className={styles.actions}>
          <Button variant="ghost" size="md" onClick={onCancelar} type="button" disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" size="md" loading={loading}
            icon={!loading ? <Icon name="check" size={15} strokeWidth={2.5} /> : undefined}>
            Guardar y continuar
          </Button>
        </div>
      </form>
    </div>
  )
}
