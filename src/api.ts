export type ServiceKey = 'clinic' | 'edu' | 'bank' | 'route' | 'users'

const bases: Record<ServiceKey, string> = {
  clinic: '/clinic-api',
  edu: '/edu-api',
  bank: '/bank-api',
  route: '/route-api',
  users: '/users-api'
}

export interface ApiErrorShape {
  mensagem?: string
  [key: string]: unknown
}

export class ApiError extends Error {
  status?: number
  details?: unknown

  constructor(message: string, status?: number, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

async function request<T>(
  service: ServiceKey,
  path: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${bases[service]}${path}`, {
    ...options,
    headers: {
      ...(options?.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options?.headers ?? {})
    }
  })

  const raw = await response.text()
  let data: unknown = null
  if (raw) {
    try { data = JSON.parse(raw) } catch { data = raw }
  }

  if (!response.ok) {
    const obj = data as ApiErrorShape | null
    const message =
      (obj && typeof obj === 'object' && typeof obj.mensagem === 'string' && obj.mensagem) ||
      (obj && typeof obj === 'object'
        ? Object.values(obj).find((v) => typeof v === 'string') as string | undefined
        : undefined) ||
      (typeof data === 'string' && data) ||
      `Erro ${response.status} ao comunicar com o servidor`
    throw new ApiError(message, response.status, data)
  }

  return data as T
}

export interface Usuario {
  id: number
  nome: string
  email: string
}

export interface UsuarioRequest {
  nome: string
  email: string
  senha: string
}

export interface Conta {
  id: number
  titular: string
  saldo: number
}

export interface TransferenciaRequest {
  contaOrigemId: number
  contaDestinoId: number
  valor: number
}

export interface CursoAluno {
  curso: string
  cargaHoraria: number
  progresso: number
}

export interface Pedido {
  id: number
  codigo: string
  statusAtual: string
  historico: string[]
}

export async function login(email: string, senha: string) {
  return request<Usuario>('users', '/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, senha })
  })
}

export async function cadastrarUsuario(dados: UsuarioRequest) {
  return request<Usuario>('users', '/usuarios', {
    method: 'POST',
    body: JSON.stringify(dados)
  })
}

export async function listarUsuarios() {
  return request<Usuario[]>('users', '/usuarios')
}

export async function horariosDisponiveis(medicoId: number, data: string) {
  return request<string[]>(
    'clinic',
    `/agenda/horarios-disponiveis?medicoId=${medicoId}&data=${encodeURIComponent(data)}`
  )
}

export async function listarContas() {
  return request<Conta[]>('bank', '/contas')
}

export async function transferir(dados: TransferenciaRequest) {
  return request<string>('bank', '/transferencias', {
    method: 'POST',
    body: JSON.stringify(dados)
  })
}

export async function cursosDoAluno(alunoId: number) {
  return request<CursoAluno[]>('edu', `/alunos/${alunoId}/cursos`)
}

export async function listarPedidos() {
  return request<Pedido[]>('route', '/pedidos')
}
