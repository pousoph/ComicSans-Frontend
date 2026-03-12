import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminLogin } from '../services/adminService'
import { useAuth } from '../context/AuthContext'
import { Btn, Input } from '../components/ui'
import { Icon } from '../components/ui/Icons'
import styles from './Login.module.css'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [form, setForm]     = useState({ usuario:'', password:'' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')
  const [shake, setShake]   = useState(false)

  const change = e => { setError(''); setForm(p=>({...p,[e.target.name]:e.target.value})) }

  const submit = async e => {
    e.preventDefault()
    if (!form.usuario||!form.password) { setError('Completa todos los campos.'); trigShake(); return }
    setLoading(true)
    const r = await adminLogin(form.usuario, form.password)
    setLoading(false)
    if (r.ok) { signIn(r.user); navigate('/admin') }
    else      { setError(r.message); trigShake() }
  }

  const trigShake = () => { setShake(true); setTimeout(()=>setShake(false),500) }

  return (
    <div className={styles.root}>
      <div className={styles.left}>
        <div className={styles.leftBg}/>
        <div className={styles.leftContent}>
          <div className={styles.logoWrap}>
            <div className={styles.logoMark}>
              <Icon name="store" size={20} color="#fff" strokeWidth={2}/>
            </div>
            <span className={styles.logoName}>Comic Sans</span>
          </div>
          <h1 className={styles.hero}>Panel de<br/>Administración</h1>
          <p className={styles.heroSub}>Gestiona usuarios, clientes, proveedores, productos y reportes desde un solo lugar.</p>
          <div className={styles.features}>
            {[
              { icon:'user',    label:'Gestión de Usuarios' },
              { icon:'users',   label:'Gestión de Clientes' },
              { icon:'truck',   label:'Proveedores' },
              { icon:'package', label:'Carga de Productos CSV' },
              { icon:'chart',   label:'Reportes y Estadísticas' },
            ].map(f=>(
              <div key={f.label} className={styles.feature}>
                <div className={styles.featureCheck}>
                  <Icon name="check" size={11} color="#fff" strokeWidth={3}/>
                </div>
                <Icon name={f.icon} size={14} color="rgba(255,255,255,0.7)" strokeWidth={1.75}/>
                <span>{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={[styles.card, shake?styles.shake:''].join(' ')}>
          <div className={styles.cardHead}>
            <span className={styles.cardEyebrow}>ACCESO ADMINISTRATIVO</span>
            <h2 className={styles.cardTitle}>Iniciar Sesión</h2>
            <p className={styles.cardSub}>Ingresa tus credenciales de administrador</p>
          </div>

          <form onSubmit={submit} noValidate className={styles.form}>
            <Input
              label="Usuario" id="usuario" name="usuario" type="text"
              autoComplete="username" placeholder="Nombre de usuario"
              value={form.usuario} onChange={change} disabled={loading}
              icon={<Icon name="user" size={15} color="var(--c-text-muted)" strokeWidth={1.75}/>}
              error={!form.usuario&&error?' ':undefined}
            />
            <Input
              label="Contraseña" id="password" name="password"
              type={showPwd?'text':'password'} autoComplete="current-password"
              placeholder="Contraseña" value={form.password} onChange={change} disabled={loading}
              icon={<Icon name="lock" size={15} color="var(--c-text-muted)" strokeWidth={1.75}/>}
              iconRight={<Icon name={showPwd?'eye-off':'eye'} size={15} color="var(--c-text-muted)" strokeWidth={1.75}/>}
              onIconRightClick={()=>setShowPwd(v=>!v)}
              error={!form.password&&error?' ':undefined}
            />
            {error && (
              <div className={styles.alert} role="alert">
                <Icon name="alert-circle" size={15} strokeWidth={2}/>
                {error}
              </div>
            )}
            <Btn type="submit" variant="primary" size="lg" full loading={loading}
              iconRight={!loading?<Icon name="arrow-right" size={16} strokeWidth={2}/>:undefined}>
              Acceder al Panel
            </Btn>
          </form>

        </div>
      </div>
    </div>
  )
}
