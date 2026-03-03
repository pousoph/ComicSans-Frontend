// useCrud.js — Manages list, modal, confirm, toast state for any CRUD module
import { useState, useEffect, useCallback } from 'react'

export function useCrud(fetchFn) {
  const [data,    setData]    = useState([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')
  // Modal state
  const [modal,   setModal]   = useState({ open:false, mode:'create', item:null })
  // Confirm delete
  const [confirm, setConfirm] = useState({ open:false, item:null, loading:false })
  // Toast
  const [toast,   setToast]   = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try { const r = await fetchFn(); if(r.ok) setData(r.data) } finally { setLoading(false) }
  }, [fetchFn])

  useEffect(() => { load() }, [load])

  const showToast = (message, type='success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  const openCreate = () => setModal({ open:true, mode:'create', item:null })
  const openEdit   = item => setModal({ open:true, mode:'edit', item })
  const closeModal = () => setModal({ open:false, mode:'create', item:null })

  const openConfirm  = item => setConfirm({ open:true, item, loading:false })
  const closeConfirm = () => setConfirm({ open:false, item:null, loading:false })
  const setConfirmLoading = v => setConfirm(p => ({...p, loading:v}))

  return {
    data, setData, loading, search, setSearch,
    modal, openCreate, openEdit, closeModal,
    confirm, openConfirm, closeConfirm, setConfirmLoading,
    toast, showToast,
    reload: load,
  }
}
