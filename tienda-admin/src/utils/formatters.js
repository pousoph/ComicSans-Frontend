export const fmtCurrency = v => new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',minimumFractionDigits:0}).format(v||0)
export const fmtDate = d => d ? new Date(d+'T00:00:00').toLocaleDateString('es-CO',{day:'2-digit',month:'short',year:'numeric'}) : '—'
export const getInitials = (n='') => n.split(' ').slice(0,2).map(w=>w[0]||'').join('').toUpperCase()
export const rolLabel = r => r==='ADMIN'?'Administrador':'Cajero'
export const rolColor = r => r==='ADMIN'?'purple':'blue'
