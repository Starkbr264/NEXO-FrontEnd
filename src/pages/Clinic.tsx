import { useEffect, useState } from 'react'
import { ApiError, horariosDisponiveis } from '../api'

const doctors = [
  { id: 1, name: 'Dra. Fernanda Lopes', specialty: 'Clínica Geral' },
  { id: 2, name: 'Dr. Rogério Matos', specialty: 'Pediatria' }
]

export default function Clinic() {
  const [doctor, setDoctor] = useState(1)
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [times, setTimes] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true); setError('')
    try {
      const data = await horariosDisponiveis(doctor, date)
      setTimes([...new Set(data)].sort())
    } catch (e) {
      setTimes([])
      setError(e instanceof ApiError ? e.message : 'Não foi possível consultar a agenda.')
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [doctor, date])

  return <div>
    <div className="page-heading">
      <div><span className="eyebrow">CLÍNICA VITALIS · :8081</span><h2>Disponibilidade da agenda</h2><p>Consulta os horários livres diretamente no endpoint do backend.</p></div>
      <div className="service-live"><span className="status-dot" /> API conectada</div>
    </div>

    <div className="panel">
      <div className="filter-grid">
        <label>Médico<select value={doctor} onChange={e => setDoctor(Number(e.target.value))}>{doctors.map(d => <option key={d.id} value={d.id}>{d.name} · {d.specialty}</option>)}</select></label>
        <label>Data<input type="date" value={date} onChange={e => setDate(e.target.value)} /></label>
        <button className="primary-button filter-button" onClick={load} disabled={loading}>{loading ? 'Consultando...' : 'Atualizar agenda'}</button>
      </div>
    </div>

    {error && <div className="alert error">{error}</div>}

    <section className="panel">
      <div className="panel-header"><div><span className="eyebrow">HORÁRIOS LIVRES</span><h3>{times.length} horários disponíveis</h3></div><span className="date-chip">{date.split('-').reverse().join('/')}</span></div>
      {loading ? <div className="loading-grid">{Array.from({length: 8}).map((_,i)=><div className="skeleton" key={i} />)}</div> :
        times.length ? <div className="time-grid">{times.map(time => <button className="time-card" key={time}><span>○</span>{time}<small>Disponível</small></button>)}</div> :
        <div className="empty-state"><strong>Nenhum horário disponível.</strong><span>O endpoint não retornou horários livres para essa combinação.</span></div>}
    </section>

    <div className="callout"><strong>Nota técnica</strong><span>O backend atual possui um chamado relacionado à duplicação dos horários. A interface usa <code>Set</code> para não exibir duplicidades enquanto o backend ainda estiver com o bug.</span></div>
  </div>
}
