import { useState } from 'react'
import { buscarClientePorCedula } from '../../services/clientService'
import { Button }      from '../ui/Button'
import { Input }       from '../ui/Input'
import { StatusBadge } from '../ui/StatusBadge'
import { Icon }        from '../ui/Icons'
import ClientRegisterForm from './ClientRegisterForm'
import styles from './ClientSearch.module.css'

export default function ClientSearch({ onClienteConfirmado, clienteActual, onReset }) {
  const [cedula, setCedula] = useState('')
  const [status, setStatus] = useState('idle')
  const [error, setError]   = useState('')

  const handleBuscar = async () => {
    if (!cedula.trim()) { setError('Ingrese una cédula para buscar.'); return }
    setError(''); setStatus('searching')
    const result = await buscarClientePorCedula(cedula.trim())
    if (result.ok) { setStatus('found'); onClienteConfirmado(result.cliente) }
    else           { setStatus('not-found') }
  }

  const handleKeyDown    = (e) => { if (e.key === 'Enter') handleBuscar() }
  const handleRegistrar  = () => setStatus('registering')
  const handleRegistroExitoso = (c) => { setStatus('found'); onClienteConfirmado(c) }
  const handleCancelarRegistro = () => setStatus('not-found')
  const handleReset = () => { setCedula(''); setStatus('idle'); setError(''); onReset() }

  if (clienteActual && status === 'found') {
    return (
      <div className={styles.foundCard + ' animate-fadeIn'}>
        <div className={styles.foundTop}>
          <StatusBadge variant="success">
            <Icon name="check" size={12} strokeWidth={3} /> Cliente verificado
          </StatusBadge>
          <button className={styles.changeBtn} onClick={handleReset} type="button">Cambiar</button>
        </div>
        <div className={styles.foundInfo}>
          <span className={styles.foundName}>{clienteActual.nombre}</span>
          <span className={styles.foundCedula}>{clienteActual.cedula}</span>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.searchRow}>
        <div className={styles.inputWrap}>
          <Input
            label="Cédula del cliente" id="cedula-cliente" type="text"
            inputMode="numeric" placeholder="Ej: 1023456789"
            value={cedula}
            onChange={e => { setCedula(e.target.value); setError(''); setStatus('idle') }}
            onKeyDown={handleKeyDown}
            icon={<Icon name="id-card" size={15} color="var(--c-text-muted)" strokeWidth={1.75} />}
            error={error}
            disabled={status === 'searching' || status === 'registering'}
            style={{ fontFamily: 'var(--font-mono)' }}
          />
        </div>
        <Button variant="primary" size="md" loading={status === 'searching'}
          disabled={status === 'registering'} onClick={handleBuscar}
          icon={status !== 'searching' ? <Icon name="search" size={15} strokeWidth={2} /> : undefined}
          className={styles.searchBtn}>
          Buscar
        </Button>
      </div>

      {status === 'idle' && (
        <div className={styles.idleState}>
          <Icon name="users" size={18} color="var(--c-text-muted)" strokeWidth={1.5} />
          <span className={styles.idleText}>Ingrese la cédula para buscar el cliente</span>
        </div>
      )}

      {status === 'not-found' && (
        <div className={`${styles.notFoundCard} animate-fadeIn`}>
          <div className={styles.notFoundTop}>
            <StatusBadge variant="error">
              <Icon name="x" size={11} strokeWidth={3} /> Cliente no encontrado
            </StatusBadge>
          </div>
          <p className={styles.notFoundMsg}>
            No existe un cliente registrado con la cédula <strong>{cedula}</strong>.
          </p>
          <div className={styles.notFoundActions}>
            <Button variant="outline-green" size="sm"
              icon={<Icon name="user-plus" size={14} strokeWidth={2} />}
              onClick={handleRegistrar}>
              Registrar cliente
            </Button>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              Intentar de nuevo
            </Button>
          </div>
        </div>
      )}

      {status === 'registering' && (
        <ClientRegisterForm
          cedulaInicial={cedula}
          onExito={handleRegistroExitoso}
          onCancelar={handleCancelarRegistro}
        />
      )}
    </div>
  )
}
