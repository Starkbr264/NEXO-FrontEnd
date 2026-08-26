import { NavLink, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import {
  ApiError,
  cadastrarUsuario,
  listarUsuarios,
  login,
  Usuario
} from './api'
import Dashboard from './pages/Dashboard'
import Clinic from './pages/Clinic'
import Bank from './pages/Bank'
import Education from './pages/Education'
import Logistics from './pages/Logistics'
import Users from './pages/Users'

const STORAGE_KEY = 'nexo_usuario'

function Logo() {
  return (
    <div className="logo-mark" aria-label="NEXO">
      <span />
      <span />
      <span />
      <span />
    </div>
  )
}

function Shell({ usuario, onLogout }: { usuario: Usuario; onLogout: () => void }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const items = [
    { to: '/', label: 'Visão geral', icon: '⌂' },
    { to: '/clinica', label: 'Clínica Vitalis', icon: '✚' },
    { to: '/banco', label: 'BancoNova', icon: '¤' },
    { to: '/eduplus', label: 'EduPlus', icon: '▣' },
    { to: '/rotalog', label: 'RotaLog', icon: '↗' },
    { to: '/usuarios', label: 'Usuários', icon: '◎' }
  ]

  useEffect(() => setMobileOpen(false), [location.pathname])

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <Logo />
          <div>
            <strong>NEXO</strong>
            <small>TECNOLOGIA</small>
          </div>
        </div>

        <div className="sidebar-section-label">CENTRAL</div>
        <nav className="sidebar-nav">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="connection">
            <span className="status-dot" />
            <div>
              <strong>Ambiente local</strong>
              <small>APIs em execução</small>
            </div>
          </div>
          <button className="ghost-button full" onClick={onLogout}>Sair</button>
        </div>
      </aside>

      <div className="main-shell">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileOpen(v => !v)}>☰</button>
          <div>
            <span className="eyebrow">CENTRAL DE OPERAÇÕES</span>
            <h1>NEXO Sistemas</h1>
          </div>
          <div className="topbar-user">
            <div className="avatar">{usuario.nome.slice(0, 1).toUpperCase()}</div>
            <div>
              <strong>{usuario.nome}</strong>
              <small>{usuario.email}</small>
            </div>
          </div>
        </header>

        <main className="page">
          <Routes>
            <Route path="/" element={<Dashboard usuario={usuario} />} />
            <Route path="/clinica" element={<Clinic />} />
            <Route path="/banco" element={<Bank />} />
            <Route path="/eduplus" element={<Education />} />
            <Route path="/rotalog" element={<Logistics />} />
            <Route path="/usuarios" element={<Users />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="footer">
          <span>NEXO Tecnologia</span>
          <span>Central integrada dos projetos 5-sistema-nexo</span>
        </footer>
      </div>
    </div>
  )
}

function Auth({ onLogin }: { onLogin: (usuario: Usuario) => void }) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setNotice('')
    setLoading(true)
    try {
      if (mode === 'login') {
        const usuario = await login(email, senha)
        onLogin(usuario)
      } else {
        await cadastrarUsuario({ nome, email, senha })
        setNotice('Cadastro concluído. Agora entre com seu e-mail e senha.')
        setMode('login')
        setSenha('')
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível acessar o backend.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="auth-glow" />
        <div className="auth-brand">
          <Logo />
          <div><strong>NEXO</strong><small>TECNOLOGIA</small></div>
        </div>
        <div className="auth-copy">
          <span className="eyebrow">PLATAFORMA INTEGRADA</span>
          <h1>Uma interface para os sistemas da NEXO.</h1>
          <p>Clínica, financeiro, educação, logística e usuários conectados aos backends reais do projeto.</p>
          <div className="mini-stats">
            <div><strong>05</strong><span>módulos</span></div>
            <div><strong>04</strong><span>APIs de negócio</span></div>
            <div><strong>01</strong><span>central</span></div>
          </div>
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-card">
          <div className="auth-tabs">
            <button className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setError('') }}>Entrar</button>
            <button className={mode === 'register' ? 'active' : ''} onClick={() => { setMode('register'); setError('') }}>Criar conta</button>
          </div>

          <div className="auth-heading">
            <span className="eyebrow">{mode === 'login' ? 'ACESSO SEGURO' : 'NOVO ACESSO'}</span>
            <h2>{mode === 'login' ? 'Bem-vindo de volta.' : 'Crie seu usuário.'}</h2>
            <p>{mode === 'login' ? 'Entre para acessar a central de operações.' : 'O cadastro será enviado diretamente ao backend Varejo Fácil.'}</p>
          </div>

          <form onSubmit={submit} className="stack-form">
            {mode === 'register' && (
              <label>Nome completo<input value={nome} onChange={e => setNome(e.target.value)} required placeholder="Seu nome" /></label>
            )}
            <label>E-mail<input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="voce@nexo.com" /></label>
            <label>Senha<input type="password" value={senha} onChange={e => setSenha(e.target.value)} minLength={mode === 'register' ? 6 : undefined} required placeholder="••••••••" /></label>

            {error && <div className="alert error">{error}</div>}
            {notice && <div className="alert success">{notice}</div>}

            <button className="primary-button" disabled={loading}>
              {loading ? 'Processando...' : mode === 'login' ? 'Entrar na central →' : 'Cadastrar usuário →'}
            </button>
          </form>

          <div className="auth-note">
            <span className="status-dot" />
            Backend de usuários: <strong>localhost:8080</strong>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  })

  function handleLogin(u: Usuario) {
    setUsuario(u)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
  }

  function handleLogout() {
    setUsuario(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  if (!usuario) return <Auth onLogin={handleLogin} />

  return <Shell usuario={usuario} onLogout={handleLogout} />
}
