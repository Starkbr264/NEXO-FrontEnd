import { useEffect, useMemo, useState } from 'react'
import { cursosDoAluno, horariosDisponiveis, listarContas, listarPedidos, Conta, CursoAluno, Pedido, Usuario } from '../api'

function Stat({ label, value, meta, icon }: { label: string; value: string; meta: string; icon: string }) {
  return <div className="stat-card">
    <div className="stat-icon">{icon}</div>
    <div className="stat-copy"><span>{label}</span><strong>{value}</strong><small>{meta}</small></div>
  </div>
}

export default function Dashboard({ usuario }: { usuario: Usuario }) {
  const [contas, setContas] = useState<Conta[]>([])
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [cursos, setCursos] = useState<CursoAluno[]>([])
  const [horarios, setHorarios] = useState<string[]>([])
  const [errors, setErrors] = useState<string[]>([])

  const hoje = new Date().toISOString().slice(0, 10)

  useEffect(() => {
    let alive = true
    Promise.allSettled([
      listarContas(),
      listarPedidos(),
      cursosDoAluno(1),
      horariosDisponiveis(1, hoje)
    ]).then(results => {
      if (!alive) return
      const nextErrors: string[] = []
      if (results[0].status === 'fulfilled') setContas(results[0].value)
      else nextErrors.push('BancoNova')
      if (results[1].status === 'fulfilled') setPedidos(results[1].value)
      else nextErrors.push('RotaLog')
      if (results[2].status === 'fulfilled') setCursos(results[2].value)
      else nextErrors.push('EduPlus')
      if (results[3].status === 'fulfilled') setHorarios([...new Set(results[3].value)])
      else nextErrors.push('Clínica Vitalis')
      setErrors(nextErrors)
    })
    return () => { alive = false }
  }, [hoje])

  const totalSaldo = useMemo(() => contas.reduce((sum, c) => sum + Number(c.saldo), 0), [contas])
  const progresso = useMemo(() => cursos.length ? Math.round(cursos.reduce((s, c) => s + c.progresso, 0) / cursos.length) : 0, [cursos])
  const entregues = pedidos.filter(p => p.statusAtual.toLowerCase().includes('entreg')).length

  return <div>
    <div className="page-heading">
      <div>
        <span className="eyebrow">VISÃO GERAL</span>
        <h2>Olá, {usuario.nome.split(' ')[0]}.</h2>
        <p>Um resumo rápido do que está acontecendo nos sistemas conectados.</p>
      </div>
      <div className="date-chip">{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}</div>
    </div>

    {errors.length > 0 && <div className="alert warning">Não foi possível consultar: {errors.join(', ')}. Confira se os respectivos backends estão ligados.</div>}

    <div className="stats-grid">
      <Stat label="Saldo agregado" value={contas.length ? totalSaldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '—'} meta={`${contas.length} contas BancoNova`} icon="¤" />
      <Stat label="Pedidos" value={String(pedidos.length || '—')} meta={`${entregues} entregues`} icon="↗" />
      <Stat label="Cursos" value={String(cursos.length || '—')} meta={`${progresso}% de progresso médio`} icon="▣" />
      <Stat label="Horários" value={String(horarios.length || '—')} meta="Dra. Fernanda · hoje" icon="✚" />
    </div>

    <div className="dashboard-grid">
      <section className="panel panel-large">
        <div className="panel-header"><div><span className="eyebrow">MÓDULOS</span><h3>Operação em um só lugar</h3></div></div>
        <div className="module-list">
          {[
            ['✚', 'Clínica Vitalis', 'Agenda e disponibilidade de consultas', '/clinica', '8081'],
            ['¤', 'BancoNova', 'Contas e transferências', '/banco', '8084'],
            ['▣', 'EduPlus', 'Cursos e progresso acadêmico', '/eduplus', '8083'],
            ['↗', 'RotaLog', 'Pedidos e histórico de rastreio', '/rotalog', '8082'],
            ['◎', 'Varejo Fácil', 'Usuários e autenticação', '/usuarios', '8080']
          ].map(([icon, title, desc, path, port]) => (
            <a className="module-row" href={path} key={path}>
              <span className="module-icon">{icon}</span>
              <div><strong>{title}</strong><span>{desc}</span></div>
              <code>:{port}</code><span className="arrow">→</span>
            </a>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-header"><div><span className="eyebrow">BANCONOVA</span><h3>Contas</h3></div></div>
        {contas.length === 0 ? <p className="muted">Nenhuma conta carregada.</p> :
          <div className="compact-list">{contas.map(c => <div className="compact-row" key={c.id}><span className="avatar small">{c.titular[0]}</span><div><strong>{c.titular}</strong><small>Conta #{c.id}</small></div><b>{Number(c.saldo).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</b></div>)}</div>}
      </section>

      <section className="panel">
        <div className="panel-header"><div><span className="eyebrow">ROTALOG</span><h3>Pedidos recentes</h3></div></div>
        {pedidos.length === 0 ? <p className="muted">Nenhum pedido carregado.</p> :
          <div className="compact-list">{pedidos.map(p => <div className="compact-row" key={p.id}><span className="route-badge">↗</span><div><strong>{p.codigo}</strong><small>{p.historico.at(-1) || 'Sem histórico'}</small></div><span className="pill">{p.statusAtual}</span></div>)}</div>}
      </section>
    </div>
  </div>
}
