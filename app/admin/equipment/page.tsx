'use client'

import { useState, useEffect, useCallback } from 'react'

interface EquipmentItem {
  id: number
  name: string
  description: string
  preis_tag: number | null
  image_url: string | null
  active: boolean
  sort_order: number
}

export default function EquipmentAdminPage() {
  const [authed, setAuthed] = useState(false)
  const [items, setItems] = useState<EquipmentItem[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showNew, setShowNew] = useState(false)

  const loadItems = useCallback(async () => {
    const res = await fetch('/api/admin/equipment')
    if (res.status === 401) { setAuthed(false); return }
    if (res.ok) {
      const data = await res.json()
      setItems(data.equipment)
      setAuthed(true)
    }
  }, [])

  useEffect(() => { loadItems() }, [loadItems])

  async function saveItem(id: number | null, data: Partial<EquipmentItem>) {
    if (id) {
      await fetch(`/api/admin/equipment/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
    } else {
      await fetch('/api/admin/equipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
    }
    setEditingId(null)
    setShowNew(false)
    loadItems()
  }

  async function toggleActive(item: EquipmentItem) {
    await fetch(`/api/admin/equipment/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !item.active }),
    })
    loadItems()
  }

  async function deleteItem(id: number) {
    if (!confirm('Equipment wirklich löschen?')) return
    await fetch(`/api/admin/equipment/${id}`, { method: 'DELETE' })
    loadItems()
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6" style={{ background: '#0c0c0c' }}>
        <div className="text-center" style={{ color: '#999', fontFamily: 'var(--font-body)' }}>
          <p>Bitte zuerst unter <a href="/admin" style={{ color: '#f97d73' }}>/admin</a> einloggen.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6" style={{ background: '#0c0c0c', color: '#ececec', paddingTop: '88px' }}>
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)' }}>
              Equipment verwalten
            </h1>
            <p className="mt-1" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: '#999' }}>
              <a href="/admin" style={{ color: '#f97d73' }}>← Zurück zu Buchungen</a>
            </p>
          </div>
          <button
            onClick={() => { setShowNew(true); setEditingId(null) }}
            className="rounded-full px-5 py-2 text-sm font-bold text-white"
            style={{ fontFamily: 'var(--font-display)', background: '#f97d73', letterSpacing: '0.05em' }}
          >
            + Neues Equipment
          </button>
        </div>

        {/* New item form */}
        {showNew && (
          <EquipmentForm
            onSave={(data) => saveItem(null, data)}
            onCancel={() => setShowNew(false)}
          />
        )}

        {/* List */}
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-xl overflow-hidden"
              style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', opacity: item.active ? 1 : 0.5 }}
            >
              {editingId === item.id ? (
                <EquipmentForm
                  initial={item}
                  onSave={(data) => saveItem(item.id, data)}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div className="flex items-center gap-4 px-6 py-4">
                  {/* Status */}
                  <span
                    className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                    style={{ background: item.active ? '#22a867' : '#666' }}
                  />
                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <span style={{ fontFamily: 'var(--font-body)', color: '#ececec' }}>
                      {item.name}
                    </span>
                    {item.preis_tag != null && (
                      <span className="ml-2" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: '#6eb8be' }}>
                        €{item.preis_tag}/Tag
                      </span>
                    )}
                    <p className="mt-1 truncate" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: '#666' }}>
                      {item.description}
                    </p>
                  </div>
                  {/* Actions */}
                  <div className="flex flex-shrink-0 gap-2">
                    <button
                      onClick={() => toggleActive(item)}
                      className="rounded-full px-3 py-1 text-xs"
                      style={{ fontFamily: 'var(--font-body)', border: '1px solid rgba(255,255,255,0.15)', color: '#999' }}
                    >
                      {item.active ? 'Deaktivieren' : 'Aktivieren'}
                    </button>
                    <button
                      onClick={() => { setEditingId(item.id); setShowNew(false) }}
                      className="rounded-full px-3 py-1 text-xs"
                      style={{ fontFamily: 'var(--font-body)', border: '1px solid rgba(255,255,255,0.15)', color: '#999' }}
                    >
                      Bearbeiten
                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="rounded-full px-3 py-1 text-xs"
                      style={{ fontFamily: 'var(--font-body)', border: '1px solid rgba(255,255,255,0.15)', color: '#e84040' }}
                    >
                      Löschen
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {items.length === 0 && (
            <div className="rounded-2xl p-12 text-center" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p style={{ fontFamily: 'var(--font-body)', color: '#999' }}>
                Noch kein Equipment eingetragen. Die Seed-Daten werden beim ersten Laden automatisch übernommen.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function EquipmentForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: EquipmentItem
  onSave: (data: Partial<EquipmentItem>) => void
  onCancel: () => void
}) {
  const [name, setName] = useState(initial?.name ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [preis, setPreis] = useState(initial?.preis_tag?.toString() ?? '')
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? '')
  const [sortOrder, setSortOrder] = useState(initial?.sort_order?.toString() ?? '0')

  const inputStyle = {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-base)',
    background: '#141414',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#ececec',
  } as const

  return (
    <div className="p-6 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs uppercase tracking-[0.15em]" style={{ fontFamily: 'var(--font-body)', color: '#666' }}>
            Name *
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg px-4 py-2.5 outline-none"
            style={inputStyle}
            placeholder="z.B. Panasonic Lumix S1H"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-[0.15em]" style={{ fontFamily: 'var(--font-body)', color: '#666' }}>
            Preis/Tag (€, leer = kein Preis)
          </label>
          <input
            value={preis}
            onChange={(e) => setPreis(e.target.value)}
            type="number"
            className="w-full rounded-lg px-4 py-2.5 outline-none"
            style={inputStyle}
            placeholder="50"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs uppercase tracking-[0.15em]" style={{ fontFamily: 'var(--font-body)', color: '#666' }}>
          Beschreibung *
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full resize-y rounded-lg px-4 py-2.5 outline-none"
          style={inputStyle}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs uppercase tracking-[0.15em]" style={{ fontFamily: 'var(--font-body)', color: '#666' }}>
            Bild-URL (optional)
          </label>
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full rounded-lg px-4 py-2.5 outline-none"
            style={inputStyle}
            placeholder="https://..."
          />
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-[0.15em]" style={{ fontFamily: 'var(--font-body)', color: '#666' }}>
            Sortierung (0 = oben)
          </label>
          <input
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            type="number"
            className="w-full rounded-lg px-4 py-2.5 outline-none"
            style={inputStyle}
          />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button
          onClick={() => onSave({
            name, description,
            preis_tag: preis ? Number(preis) : null,
            image_url: imageUrl || null,
            sort_order: Number(sortOrder) || 0,
          })}
          disabled={!name || !description}
          className="rounded-full px-5 py-2 text-sm font-bold text-white disabled:opacity-40"
          style={{ fontFamily: 'var(--font-body)', background: '#22a867' }}
        >
          Speichern
        </button>
        <button
          onClick={onCancel}
          className="rounded-full px-5 py-2 text-sm"
          style={{ fontFamily: 'var(--font-body)', border: '1px solid rgba(255,255,255,0.15)', color: '#999' }}
        >
          Abbrechen
        </button>
      </div>
    </div>
  )
}
