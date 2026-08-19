const API_URL = 'http://localhost:8080/api'

export interface UsuarioRequest {
  nome: string
  email: string
  senha: string
}

export interface UsuarioResponse {
  id: number
  nome: string
  email: string
}

export interface LoginRequest {
  email: string
  senha: string
}

// Erro customizado para carregar as mensagens vindas da API
export class ApiError extends Error {
  campos?: Record<string, string>

  constructor(message: string, campos?: Record<string, string>) {
    super(message)
    this.campos = campos
  }
}

async function tratarResposta<T>(res: Response): Promise<T> {
  if (res.ok) {
    return res.json() as Promise<T>
  }

  const corpo = await res.json().catch(() => ({}))

  if (corpo.mensagem) {
    throw new ApiError(corpo.mensagem)
  }

  // erros de validacao vem como { campo: "mensagem" }
  const primeiraMensagem = Object.values(corpo)[0] as string | undefined
  throw new ApiError(primeiraMensagem ?? 'Erro inesperado ao falar com o servidor', corpo)
}

export async function cadastrarUsuario(dados: UsuarioRequest): Promise<UsuarioResponse> {
  const res = await fetch(`${API_URL}/usuarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  })
  return tratarResposta<UsuarioResponse>(res)
}

export async function listarUsuarios(): Promise<UsuarioResponse[]> {
  const res = await fetch(`${API_URL}/usuarios`)
  return tratarResposta<UsuarioResponse[]>(res)
}

export async function login(dados: LoginRequest): Promise<UsuarioResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  })
  return tratarResposta<UsuarioResponse>(res)
}
