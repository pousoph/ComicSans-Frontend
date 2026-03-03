import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/authService'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'
import { Input }  from '../components/ui/Input'
import { Icon }   from '../components/ui/Icons'
import styles from './Login.module.css'

export default function Login() {
  const navigate = useNavigate()
  const { signIn } = useAuth()

  const [form, setForm]       = useState({ usuario: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [shake, setShake]     = useState(false)

  const handleChange = (e) => {
    setError('')
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.usuario || !form.password) {
      setError('Ingrese usuario y contraseña para continuar.')
      triggerShake()
      return
    }
    setLoading(true)
    setError('')
    try {
      const result = await login(form.usuario, form.password)
      if (result.ok) { signIn(result.user); navigate('/pos') }
      else           { setError(result.message); triggerShake() }
    } finally { setLoading(false) }
  }

  const triggerShake = () => { setShake(true); setTimeout(() => setShake(false), 500) }

  return (
    <div className={styles.root}>
      {/* ── Left panel ── */}
      <div className={styles.left}>
        <div className={styles.leftContent}>
          <div className={styles.logoMark}>
            <Icon name="store" size={32} color="#fff" strokeWidth={1.75} />
          </div>
          <h1 className={styles.brandName}>Comic Sans</h1>
          <p className={styles.brandSub}>Punto de Venta</p>
          <div className={styles.divider} />
          <p className={styles.brandDesc}>
            Acceso exclusivo para cajeros autorizados del sistema.
          </p>
          <div className={styles.pills}>
            <span className={styles.pill}>
              <Icon name="lock" size={12} strokeWidth={2} /> Acceso seguro
            </span>
            <span className={styles.pill}>
              <Icon name="trending-up" size={12} strokeWidth={2} /> Ventas en tiempo real
            </span>
            <span className={styles.pill}>
              <Icon name="file-text" size={12} strokeWidth={2} /> Registro automático
            </span>
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className={styles.right}>
        <div className={[styles.card, shake ? styles.shake : ''].join(' ')}>
          <span className={styles.cardLabel}>SISTEMA DE CAJA</span>
          <h2 className={styles.cardTitle}>Iniciar Sesión</h2>
          <p className={styles.cardSub}>Ingresa tus credenciales para continuar</p>

          <form onSubmit={handleSubmit} noValidate className={styles.form}>
            <Input
              label="Usuario" id="usuario" name="usuario" type="text"
              autoComplete="username" placeholder="Tu nombre de usuario"
              value={form.usuario} onChange={handleChange}
              icon={<Icon name="user" size={15} color="var(--c-text-muted)" strokeWidth={1.75} />}
              error={!form.usuario && error ? ' ' : ''}
              disabled={loading}
            />
            <Input
              label="Contraseña" id="password" name="password"
              type={showPwd ? 'text' : 'password'}
              autoComplete="current-password" placeholder="Tu contraseña"
              value={form.password} onChange={handleChange}
              icon={<Icon name="lock" size={15} color="var(--c-text-muted)" strokeWidth={1.75} />}
              iconRight={<Icon name={showPwd ? 'eye-off' : 'eye'} size={15} color="var(--c-text-muted)" strokeWidth={1.75} />}
              onIconRightClick={() => setShowPwd(v => !v)}
              error={!form.password && error ? ' ' : ''}
              disabled={loading}
            />

            {error && (
              <div className={styles.errorAlert} role="alert">
                <Icon name="alert-circle" size={14} strokeWidth={2} /> {error}
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}
              iconRight={!loading ? <Icon name="arrow-right" size={16} strokeWidth={2} /> : undefined}>
              Ingresar al Sistema
            </Button>
          </form>

          <p className={styles.helpText}>
            ¿Problemas para ingresar?{' '}
            <span className={styles.helpLink}>Contacta al administrador</span>
          </p>
          <div className={styles.demoHint}>
            <strong>Demo:</strong> usuario <code>jperez</code> / contraseña <code>1234</code>
          </div>
        </div>
      </div>
    </div>
  )
}
