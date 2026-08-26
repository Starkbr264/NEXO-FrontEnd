import { useEffect, useState } from 'react'
import { ApiError, listarUsuarios, Usuario } from '../api'

export default function Users() {
  const [users, setUsers] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true); setError('')
    try { setUsers(await listarUsuarios()) }
    catch (e) { setError(e instanceof ApiError ? e.message : 'Não foi possível carregar os usuários.') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  return <div>
    <div className="page-heading">
      <div><span className="eyebrow">VAREJO FÁCIL · :8080</span><h2>Usuários do sistema</h2><p>Cadastros retornados pelo backend de autenticação.</p></div>
      <button className="secondary-button" onClick={load}>↻ Atualizar</button>
    </div>
    {error && <div className="alert error">{error}</div>}
    <section className="panel">
      <div className="panel-header"><div><span className="eyebrow">DIRETÓRIO</span><h3>{users.length} usuários</h3></div></div>
      {loading ? <div className="skeleton-list">{Array.from({length:4}).map((_,i)=><div className="skeleton line" key={i}/>)}</div> :
        users.length ? <div className="users-table-wrap"><table><thead><tr><th>ID</th><th>Nome</th><th>E-mail</th></tr></thead><tbody>{users.map(u=><tr key={u.id}><td><code>#{u.id}</code></td><td><div className="table-person"><span className="avatar small">{u.nome[0]}</span><strong>{u.nome}</strong></div></td><td>{u.email}</td></tr>)}</tbody></table></div> :
        <div className="empty-state"><strong>Nenhum usuário cadastrado.</strong><span>Crie uma conta pela tela inicial.</span></div>}
    </section>
  </div>
}
