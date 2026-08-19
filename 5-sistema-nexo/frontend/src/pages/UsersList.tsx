import { useEffect, useState } from 'react'
import { listarUsuarios, UsuarioResponse } from '../api'

export default function UsersList() {
  const [usuarios, setUsuarios] = useState<UsuarioResponse[]>([])
  const [erro, setErro] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    carregar()
  }, [])

  async function carregar() {
    setCarregando(true)
    setErro(null)
    try {
      const lista = await listarUsuarios()
      setUsuarios(lista)
    } catch {
      setErro('Não foi possível conectar ao servidor. O backend está rodando?')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="card card-wide">
      <div className="list-header">
        <div>
          <h1>Usuários cadastrados</h1>
          <p className="subtitle">Todos os colaboradores registrados no sistema.</p>
        </div>
        <button onClick={carregar} disabled={carregando}>
          {carregando ? 'Atualizando...' : 'Atualizar'}
        </button>
      </div>

      {erro && <div className="alert alert-error">{erro}</div>}

      {!erro && usuarios.length === 0 && !carregando && (
        <p className="empty">Nenhum usuário cadastrado ainda.</p>
      )}

      {usuarios.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>E-mail</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.nome}</td>
                <td>{u.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
