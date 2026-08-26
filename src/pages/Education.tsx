import { useEffect, useState } from 'react'
import { ApiError, cursosDoAluno, CursoAluno } from '../api'

export default function Education() {
  const [courses, setCourses] = useState<CursoAluno[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true); setError('')
    try { setCourses(await cursosDoAluno(1)) }
    catch (e) { setError(e instanceof ApiError ? e.message : 'Não foi possível carregar os cursos.') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const average = courses.length ? Math.round(courses.reduce((s,c) => s+c.progresso,0)/courses.length) : 0

  return <div>
    <div className="page-heading">
      <div><span className="eyebrow">EDUPLUS · :8083</span><h2>Minha formação</h2><p>Aluno de demonstração: <strong>Marina Souza</strong> · matrícula #1.</p></div>
      <div className="progress-ring"><strong>{average}%</strong><small>média</small></div>
    </div>

    {error && <div className="alert error">{error}</div>}
    <section className="panel">
      <div className="panel-header"><div><span className="eyebrow">CURSOS MATRICULADOS</span><h3>{courses.length} cursos</h3></div><button className="secondary-button" onClick={load}>↻ Atualizar</button></div>
      {loading ? <div className="course-grid">{Array.from({length:5}).map((_,i)=><div className="course-card skeleton-card" key={i}/>)}</div> :
        <div className="course-grid">{courses.map((c,i) => <article className="course-card" key={`${c.curso}-${i}`}><div className="course-number">{String(i+1).padStart(2,'0')}</div><div className="course-body"><span className="eyebrow">{c.cargaHoraria} HORAS</span><h3>{c.curso}</h3><div className="progress-meta"><span>Progresso</span><strong>{c.progresso}%</strong></div><div className="progress"><span style={{width:`${c.progresso}%`}} /></div></div></article>)}</div>}
    </section>

    <div className="callout"><strong>Nota técnica</strong><span>O endpoint atual é <code>GET /api/alunos/1/cursos</code>. Ele contém o cenário clássico de N+1 descrito no chamado do backend.</span></div>
  </div>
}
