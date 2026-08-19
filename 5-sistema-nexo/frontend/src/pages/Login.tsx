import { FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { ApiError, login, UsuarioResponse } from '../api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [usuarioLogado, setUsuarioLogado] = useState<UsuarioResponse | null>(null)
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErro(null)
    setUsuarioLogado(null)
    setCarregando(true)

    try {
      const usuario = await login({ email, senha })
      setUsuarioLogado(usuario)
    } catch (err) {
      if (err instanceof ApiError) {
        setErro(err.message)
      } else {
        setErro('Não foi possível conectar ao servidor. O backend está rodando?')
      }
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="card">
      <h1>Entrar</h1>
      <p className="subtitle">Acesse com um usuário já cadastrado no sistema.</p>

      <form onSubmit={handleSubmit} className="form">
        {erro && (
          <div className="alert alert-error">
            <span className="alert-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#c22e45" strokeWidth="2" />
                <line x1="12" y1="8" x2="12" y2="13" stroke="#c22e45" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="16" r="1" fill="#c22e45" />
              </svg>
            </span>
            <span>{erro}</span>
          </div>
        )}

        {usuarioLogado && (
          <div className="alert alert-success">
            Bem-vindo(a), {usuarioLogado.nome}! Login realizado com sucesso.
          </div>
        )}

        <label>
          E-mail
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="seu@email.com"
          />
        </label>

        <label>
          Senha
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            placeholder="••••••••"
          />
        </label>

        <button type="submit" disabled={carregando} className="btn-block">
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>

        <p className="form-footer">
          Não tem conta? <Link to="/cadastro">Criar Conta</Link>
        </p>
      </form>
    </div>
  )
}
