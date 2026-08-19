import { NavLink, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import UsersList from './pages/UsersList'

export default function App() {
  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <span className="wordmark">
              NEXO
            </span>
          </div>
          <nav>
            <NavLink to="/" end>
              Entrar
            </NavLink>
            <NavLink to="/cadastro">Cadastrar</NavLink>
            <NavLink to="/usuarios">Usuários</NavLink>
          </nav>
        </div>
      </header>

      <main className="content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/cadastro" element={<Register />} />
          <Route path="/usuarios" element={<UsersList />} />
        </Routes>
      </main>
    </div>
  )
}
