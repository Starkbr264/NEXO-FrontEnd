import { useEffect, useMemo, useState } from 'react'
import { ApiError, listarPedidos, Pedido } from '../api'

export default function Logistics() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true); setError('')
    try {
      const data = await listarPedidos()
      setPedidos(data)
      setSelected(data[0]?.codigo ?? null)
    } catch (e) { setError(e instanceof ApiError ? e.message : 'Não foi possível carregar os pedidos.') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const active = useMemo(() => pedidos.find(p => p.codigo === selected) ?? null, [pedidos, selected])

  return <div>
    <div className="page-heading">
      <div><span className="eyebrow">ROTALOG · :8082</span><h2>Rastreamento de pedidos</h2><p>Pedidos e histórico vindos diretamente da API de logística.</p></div>
      <button className="secondary-button" onClick={load}>↻ Atualizar</button>
    </div>

    {error && <div className="alert error">{error}</div>}

    <div className="logistics-grid">
      <section className="panel">
        <div className="panel-header"><div><span className="eyebrow">PEDIDOS</span><h3>{pedidos.length} registros</h3></div></div>
        {loading ? <div className="skeleton-list">{Array.from({length:2}).map((_,i)=><div className="skeleton line" key={i}/>)}</div> :
          <div className="order-list">{pedidos.map(p => <button className={`order-row ${selected===p.codigo?'selected':''}`} key={p.codigo} onClick={() => setSelected(p.codigo)}><div><strong>{p.codigo}</strong><span>{p.historico.at(-1) || 'Sem evento'}</span></div><span className="pill">{p.statusAtual}</span></button>)}</div>}
      </section>

      <section className="panel">
        <div className="panel-header"><div><span className="eyebrow">HISTÓRICO</span><h3>{active?.codigo ?? 'Selecione um pedido'}</h3></div>{active && <span className="service-live"><span className="status-dot"/>Ativo</span>}</div>
        {active ? <div className="timeline">{active.historico.map((event, i) => <div className="timeline-item" key={`${event}-${i}`}><span className="timeline-dot">{i+1}</span><div><strong>{event}</strong><small>Evento {i+1} do pedido</small></div></div>)}</div> :
          <div className="empty-state"><strong>Nenhum pedido selecionado.</strong><span>Escolha um pedido à esquerda para ver o histórico.</span></div>}
      </section>
    </div>

    <div className="callout"><strong>Nota técnica</strong><span>O backend ainda não implementou o endpoint separado <code>/api/pedidos/&#123;codigo&#125;/rastreio</code>. Por isso a interface usa o histórico já retornado por <code>GET /api/pedidos</code>.</span></div>
  </div>
}
