import { useMemo, useState } from 'react'
import './App.css'

type Estado = 'Confirmado' | 'Pendiente' | 'Realizado' | 'Cancelado'

type Turno = {
  id: number
  mascota: string
  duenio: string
  telefono: string
  servicio: string
  fecha: string
  hora: string
  estado: Estado
}

const iniciales: Turno[] = [
  { id: 1, mascota: 'Roco', duenio: 'Eugenia Pérez', telefono: '2615551234', servicio: 'Baño y corte', fecha: '2026-10-27', hora: '10:00', estado: 'Confirmado' },
  { id: 2, mascota: 'Toby', duenio: 'Juan López', telefono: '2615552345', servicio: 'Baño', fecha: '2026-10-27', hora: '11:00', estado: 'Pendiente' },
  { id: 3, mascota: 'Luna', duenio: 'Sofía Díaz', telefono: '2615553456', servicio: 'Corte', fecha: '2026-10-27', hora: '12:00', estado: 'Confirmado' },
  { id: 4, mascota: 'Milo', duenio: 'Camila Ruiz', telefono: '2615554567', servicio: 'Baño y corte', fecha: '2026-10-28', hora: '09:30', estado: 'Pendiente' },
]

const fechaHoy = '2026-10-27'

const nuevoTurno = (): Omit<Turno, 'id'> => ({
  mascota: '',
  duenio: '',
  telefono: '',
  servicio: 'Baño',
  fecha: fechaHoy,
  hora: '10:00',
  estado: 'Pendiente',
})

function App() {
  const [turnos, setTurnos] = useState<Turno[]>(iniciales)
  const [busqueda, setBusqueda] = useState('')
  const [filtro, setFiltro] = useState('Todos')
  const [fecha, setFecha] = useState(fechaHoy)
  const [modal, setModal] = useState(false)
  const [editando, setEditando] = useState<number | null>(null)
  const [form, setForm] = useState(nuevoTurno())

  const visibles = useMemo(() => turnos
    .filter(t => filtro === 'Todos' || t.estado === filtro)
    .filter(t => !fecha || t.fecha === fecha)
    .filter(t => `${t.mascota} ${t.duenio} ${t.servicio}`.toLowerCase().includes(busqueda.toLowerCase()))
    .sort((a, b) => a.hora.localeCompare(b.hora)),
  [turnos, filtro, fecha, busqueda])

  const hoy = turnos.filter(t => t.fecha === fechaHoy && t.estado !== 'Cancelado').length
  const pendientes = turnos.filter(t => t.estado === 'Pendiente').length
  const confirmados = turnos.filter(t => t.estado === 'Confirmado').length

  function abrirNuevo() {
    setEditando(null)
    setForm(nuevoTurno())
    setModal(true)
  }

  function abrirEdicion(t: Turno) {
    setEditando(t.id)
    setForm({
      mascota: t.mascota,
      duenio: t.duenio,
      telefono: t.telefono,
      servicio: t.servicio,
      fecha: t.fecha,
      hora: t.hora,
      estado: t.estado,
    })
    setModal(true)
  }

  function guardar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (editando !== null) {
      setTurnos(prev => prev.map(t => t.id === editando ? { ...form, id: editando } : t))
    } else {
      setTurnos(prev => [...prev, { ...form, id: Date.now() }])
    }

    setModal(false)
  }

  function cambiarEstado(id: number, estado: Estado) {
    setTurnos(prev => prev.map(t => t.id === id ? { ...t, estado } : t))
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">🐾</div>
          <div><strong>coquetos</strong><span>PELUQUERÍA CANINA</span></div>
        </div>

        <p className="nav-label">MENÚ PRINCIPAL</p>
        <div className="nav-item active">▦ <span>Agenda de turnos</span></div>
        <div className="nav-item">♡ <span>Clientes y mascotas</span></div>
        <div className="nav-item">✂ <span>Servicios</span></div>

        <div className="sidebar-bottom">
          <div className="paw-decoration">🐕</div>
          <strong>Un mimo para cada mascota</strong>
          <p>Cuidamos a quienes más querés.</p>
        </div>
      </aside>

      <section className="main-content">
        <header className="topbar">
          <div><span className="breadcrumb">Coquetos /</span> Agenda</div>
          <div className="profile"><span>🐾</span><div><strong>Administración</strong><small>Panel de gestión</small></div></div>
        </header>

        <div className="page-content">
          <div className="welcome">
            <div>
              <p className="eyebrow">TU ESPACIO DE CUIDADO ANIMAL</p>
              <h1>Agenda de turnos <span>🐾</span></h1>
              <p className="subtitle">Organizá los turnos y dedicá más tiempo a mimarlos.</p>
            </div>
            <button className="primary-button" onClick={abrirNuevo}>＋ Nuevo turno</button>
          </div>

          <div className="stats">
            <article className="stat-card"><div className="stat-icon lilac">▦</div><div><p>Turnos de hoy</p><strong>{hoy}</strong><small>Turnos agendados para hoy</small></div></article>
            <article className="stat-card"><div className="stat-icon peach">◷</div><div><p>Pendientes</p><strong>{pendientes}</strong><small>Esperando confirmación</small></div></article>
            <article className="stat-card"><div className="stat-icon mint">✓</div><div><p>Confirmados</p><strong>{confirmados}</strong><small>Listos para recibirlos</small></div></article>
          </div>

          <section className="appointments">
            <div className="section-heading">
              <div><h2>Turnos agendados</h2><p>Consultá y administrá las próximas visitas.</p></div>
              <span className="result-count">{visibles.length} turnos</span>
            </div>

            <div className="filters">
              <label className="search-box">⌕ <input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar mascota o dueño..." /></label>
              <label className="date-filter">Fecha <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} /></label>
              <select value={filtro} onChange={e => setFiltro(e.target.value)} aria-label="Filtrar por estado">
                {['Todos', 'Pendiente', 'Confirmado', 'Realizado', 'Cancelado'].map(x => <option key={x}>{x}</option>)}
              </select>
            </div>

            <div className="table-wrap">
              <table>
                <thead><tr><th>HORARIO</th><th>MASCOTA / DUEÑO</th><th>SERVICIO</th><th>ESTADO</th><th>ACCIONES</th></tr></thead>
                <tbody>
                  {visibles.map(t => (
                    <tr key={t.id}>
                      <td><strong>{t.hora}</strong><small>{t.fecha}</small></td>
                      <td><div className="pet-cell"><span className="pet-avatar">🐶</span><div><strong>{t.mascota}</strong><small>{t.duenio}</small></div></div></td>
                      <td>{t.servicio}</td>
                      <td><span className={`status status-${t.estado.toLowerCase()}`}>{t.estado}</span></td>
                      <td><div className="actions"><button title="Editar turno" onClick={() => abrirEdicion(t)}>✎</button><select aria-label={`Cambiar estado de ${t.mascota}`} value={t.estado} onChange={e => cambiarEstado(t.id, e.target.value as Estado)}>{['Pendiente', 'Confirmado', 'Realizado', 'Cancelado'].map(x => <option key={x}>{x}</option>)}</select></div></td>
                    </tr>
                  ))}
                  {visibles.length === 0 && <tr><td colSpan={5} className="empty">No hay turnos para estos filtros.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>

          <footer>Hecho con cariño para <strong>Coquetos</strong> 🐾</footer>
        </div>
      </section>

      {modal && <div className="modal-backdrop" onClick={() => setModal(false)}>
        <form className="turn-modal" onSubmit={guardar} onClick={e => e.stopPropagation()}>
          <div className="modal-heading"><div><p className="eyebrow">AGENDA COQUETOS</p><h2>{editando !== null ? 'Editar turno' : 'Agendar un turno'}</h2></div><button type="button" className="close-button" onClick={() => setModal(false)}>×</button></div>
          <label>Nombre de la mascota<input required maxLength={80} value={form.mascota} onChange={e => setForm({ ...form, mascota: e.target.value })} placeholder="Ej. Lola" /></label>
          <label>Nombre del dueño<input required maxLength={100} value={form.duenio} onChange={e => setForm({ ...form, duenio: e.target.value })} placeholder="Ej. María Pérez" /></label>
          <label>Teléfono<input value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} placeholder="Ej. 261..." /></label>
          <div className="form-row"><label>Servicio<select value={form.servicio} onChange={e => setForm({ ...form, servicio: e.target.value })}><option>Baño</option><option>Corte</option><option>Baño y corte</option><option>Corte de uñas</option></select></label><label>Estado<select value={form.estado} onChange={e => setForm({ ...form, estado: e.target.value as Estado })}>{['Pendiente', 'Confirmado', 'Realizado', 'Cancelado'].map(x => <option key={x}>{x}</option>)}</select></label></div>
          <div className="form-row"><label>Fecha<input type="date" required value={form.fecha} onChange={e => setForm({ ...form, fecha: e.target.value })} /></label><label>Horario<input type="time" required value={form.hora} onChange={e => setForm({ ...form, hora: e.target.value })} /></label></div>
          <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setModal(false)}>Cancelar</button><button type="submit" className="primary-button">Guardar turno</button></div>
        </form>
      </div>}
    </main>
  )
}

export default App