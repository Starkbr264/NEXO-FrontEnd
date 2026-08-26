import { useEffect, useState } from 'react'
import { ApiError, Conta, listarContas, transferir } from '../api'

export default function Bank() {
  const [contas, setContas] = useState<Conta[]>([])
  const [origem, setOrigem] = useState<number | ''>('')
  const [destino, setDestino] = useState<number | ''>('')
  const [valor, setValor] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function load() {
    setLoading(true); setError('')
    try {
      const data = await listarContas()
      setContas(data)
      if (data.length >= 2) { setOrigem(data[0].id); setDestino(data[1].id) }
    } catch (e) { setError(e instanceof ApiError ? e.message : 'Não foi possível carregar as contas.') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(''); setError('')
    const amount = Number(valor)
    if (!origem || !destino || origem === destino || !amount || amount <= 0) {
      setError('Informe contas diferentes e um valor maior que zero.')
      return
    }
    setSending(true)
    try {
      await transferir({ contaOrigemId: Number(origem), contaDestinoId: Number(destino), valor: amount })
      setMessage('Transferência realizada com sucesso.')
      setValor('')
      await load()
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'A transferência não foi concluída.')
    } finally { setSending(false) }
  }

  return <div>
    <div className="page-heading">
      <div><span className="eyebrow">BANCONOVA · :8084</span><h2>Operações financeiras</h2><p>Consulte saldos e envie transferências pelo backend BancoNova.</p></div>
      <button className="secondary-button" onClick={load}>↻ Atualizar</button>
    </div>

    {error && <div className="alert error">{error}</div>}
    {message && <div className="alert success">{message}</div>}

    <div className="bank-grid">
      <section className="panel">
        <div className="panel-header"><div><span className="eyebrow">CONTAS</span><h3>Saldos disponíveis</h3></div></div>
        {loading ? <div className="skeleton-list">{Array.from({length:2}).map((_,i)=><div className="skeleton line" key={i}/>)}</div> :
          <div className="account-list">{contas.map(c => <div className="account-card" key={c.id}><div className="account-top"><span className="avatar">{c.titular[0]}</span><span>Conta #{c.id}</span></div><strong>{Number(c.saldo).toLocaleString('pt-BR', {style:'currency',currency:'BRL'})}</strong><small>{c.titular}</small></div>)}</div>}
      </section>

      <section className="panel">
        <div className="panel-header"><div><span className="eyebrow">NOVA OPERAÇÃO</span><h3>Transferir</h3></div></div>
        <form className="stack-form" onSubmit={submit}>
          <label>Conta de origem<select value={origem} onChange={e => setOrigem(e.target.value ? Number(e.target.value) : '')}>{contas.map(c => <option key={c.id} value={c.id}>{c.titular} · #{c.id}</option>)}</select></label>
          <label>Conta de destino<select value={destino} onChange={e => setDestino(e.target.value ? Number(e.target.value) : '')}>{contas.map(c => <option key={c.id} value={c.id}>{c.titular} · #{c.id}</option>)}</select></label>
          <label>Valor<input type="number" min="0.01" step="0.01" value={valor} onChange={e => setValor(e.target.value)} placeholder="0,00" /></label>
          <button className="primary-button" disabled={sending || !contas.length}>{sending ? 'Enviando...' : 'Confirmar transferência →'}</button>
        </form>
        <div className="callout warning"><strong>Atenção</strong><span>O backend atual contém um chamado para validar saldo insuficiente. A interface bloqueia valores inválidos, mas a regra definitiva precisa estar no servidor.</span></div>
      </section>
    </div>
  </div>
}
