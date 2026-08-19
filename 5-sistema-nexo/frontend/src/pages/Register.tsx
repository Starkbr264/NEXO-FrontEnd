import { FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { ApiError, cadastrarUsuario } from '../api'

export default function Register() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [sucesso, setSucesso] = useState(false)
  const [carregando, setCarregando] = useState(false)

  // erro relacionado ao e-mail (ex.: já cadastrado) destaca o campo, como no Figma
  const erroNoEmail = erro !== null && erro.toLowerCase().includes('email')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErro(null)
    setSucesso(false)
    setCarregando(true)

    try {
      await cadastrarUsuario({ nome, email, senha })
      setSucesso(true)
      setNome('')
      setEmail('')
      setSenha('')
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

  if (sucesso) {
    return (
      <div className="card">
        <div className="success-view">
          <div className="success-icon">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 12.5L9.5 18L20 6"
                stroke="#0b5d34"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1>Conta criada</h1>
          <p className="subtitle">
            Sua conta foi criada com sucesso. Agora você já pode aproveitar o sistema NEXO.
          </p>
          <Link to="/" style={{ textDecoration: 'none', width: '100%' }}>
            <button type="button" className="btn-block">
              Ir para o sistema
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h1>Criar Conta</h1>
      <p className="subtitle">Cria um novo colaborador no sistema da NEXO.</p>

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

        <label>
          Nome Completo
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            placeholder="Nome completo"
          />
        </label>

        <label className={erroNoEmail ? 'field-error' : undefined}>
          E-mail
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="seu@email.com"
            className={erroNoEmail ? 'input-error' : undefined}
          />
        </label>

        <label>
          Senha
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            placeholder="mínimo 6 caracteres"
          />
        </label>

        <button type="submit" disabled={carregando} className="btn-block">
          {carregando ? 'Cadastrando...' : 'Cadastrar'}
        </button>

        <p className="form-footer">
          Já tem conta? <Link to="/">Entrar</Link>
        </p>
      </form>
    </div>
  )
}
