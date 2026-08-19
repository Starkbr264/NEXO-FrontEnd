// Camada de acesso à API do backend BancoNova (Spring Boot, porta 8084).
// Em desenvolvimento, o Vite (vite.config.js) faz proxy de /api -> :8084,
// então aqui usamos sempre caminhos relativos.

const BASE = '/api'

export async function listarContas() {
  const res = await fetch(`${BASE}/contas`)
  if (!res.ok) {
    throw new Error('Não foi possível carregar as contas.')
  }
  return res.json()
}

export async function transferir({ contaOrigemId, contaDestinoId, valor }) {
  const res = await fetch(`${BASE}/transferencias`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contaOrigemId, contaDestinoId, valor }),
  })

  const texto = await res.text()

  if (!res.ok) {
    // O backend hoje responde 200 sempre que as contas existem; isso aqui
    // cobre erros de conta inexistente ou, quando a validação de saldo for
    // implementada, uma resposta de erro vinda do servidor.
    throw new Error(texto || 'Não foi possível concluir a transferência.')
  }

  return texto
}
