import { useEffect, useMemo, useState } from 'react'
import { listarContas, transferir } from './api'
import './app.css'

const formatarMoeda = (valor) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(valor))

function LogoNova() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 1l2.6 7.2L22 11l-7.4 2.8L12 21l-2.6-7.2L2 11l7.4-2.8z" fill="var(--accent)" />
    </svg>
  )
}

function ContaCard({ conta, destaque }) {
  const negativo = Number(conta.saldo) < 0
  return (
    <div className={`conta-card${destaque ? ' conta-card--pulse' : ''}`}>
      <div className="conta-card__topo">
        <span className="conta-card__titular">{conta.titular}</span>
        <span className="conta-card__id">conta #{conta.id}</span>
      </div>
      <div className={`conta-card__saldo${negativo ? ' conta-card__saldo--negativo' : ''}`}>
        {formatarMoeda(conta.saldo)}
      </div>
    </div>
  )
}

export default function App() {
  const [contas, setContas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erroCarregamento, setErroCarregamento] = useState(null)

  const [origemId, setOrigemId] = useState('')
  const [destinoId, setDestinoId] = useState('')
  const [valor, setValor] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [mensagem, setMensagem] = useState(null) // { tipo: 'sucesso' | 'erro', texto }
  const [contaAtualizadaId, setContaAtualizadaId] = useState(null)

  async function carregarContas() {
    try {
      setErroCarregamento(null)
      const dados = await listarContas()
      setContas(dados)
    } catch (err) {
      setErroCarregamento(err.message)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarContas()
  }, [])

  const contaOrigem = useMemo(
    () => contas.find((c) => String(c.id) === String(origemId)),
    [contas, origemId],
  )

  const saldoInsuficiente = Boolean(
    contaOrigem && valor && Number(valor) > Number(contaOrigem.saldo),
  )

  const podeTransferir = Boolean(
    origemId &&
    destinoId &&
    origemId !== destinoId &&
    Number(valor) > 0 &&
    !enviando,
  )

  async function handleSubmit(e) {
    e.preventDefault()
    if (!podeTransferir) return

    setEnviando(true)
    setMensagem(null)
    try {
      const texto = await transferir({
        contaOrigemId: Number(origemId),
        contaDestinoId: Number(destinoId),
        valor: Number(valor),
      })
      setMensagem({ tipo: 'sucesso', texto: texto || 'Transferência realizada.' })
      setContaAtualizadaId(origemId)
      await carregarContas()
      setTimeout(() => setContaAtualizadaId(null), 900)
    } catch (err) {
      setMensagem({ tipo: 'erro', texto: err.message })
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="pagina">
      <header className="topo">
        <div className="topo__marca">
          <LogoNova />
          <div>
            <h1>BancoNova</h1>
            <p>mantido pela NEXO Tecnologia</p>
          </div>
        </div>
        <button className="botao-fantasma" onClick={carregarContas} disabled={carregando}>
          {carregando ? 'Atualizando…' : 'Atualizar saldos'}
        </button>
      </header>

      <main className="conteudo">
        <section className="secao-contas" aria-label="Contas">
          <h2>Contas</h2>

          {carregando && <p className="texto-muted">Carregando contas…</p>}

          {erroCarregamento && (
            <div className="aviso aviso--erro">
              Não deu para falar com o backend. Confirme que o BancoNova (Spring Boot) está
              rodando em <code>localhost:8084</code>.
              <br />
              <span className="texto-muted">{erroCarregamento}</span>
            </div>
          )}

          {!carregando && !erroCarregamento && contas.length === 0 && (
            <p className="texto-muted">Nenhuma conta cadastrada ainda.</p>
          )}

          <div className="grade-contas">
            {contas.map((conta) => (
              <ContaCard
                key={conta.id}
                conta={conta}
                destaque={String(conta.id) === String(contaAtualizadaId)}
              />
            ))}
          </div>
        </section>

        <section className="secao-transferencia" aria-label="Nova transferência">
          <h2>Nova transferência</h2>

          <form className="painel" onSubmit={handleSubmit}>
            <label className="campo">
              <span>Conta de origem</span>
              <select value={origemId} onChange={(e) => setOrigemId(e.target.value)} required>
                <option value="" disabled>
                  Selecione
                </option>
                {contas.map((c) => (
                  <option key={c.id} value={c.id}>
                    #{c.id} — {c.titular} ({formatarMoeda(c.saldo)})
                  </option>
                ))}
              </select>
            </label>

            <label className="campo">
              <span>Conta de destino</span>
              <select value={destinoId} onChange={(e) => setDestinoId(e.target.value)} required>
                <option value="" disabled>
                  Selecione
                </option>
                {contas
                  .filter((c) => String(c.id) !== String(origemId))
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      #{c.id} — {c.titular}
                    </option>
                  ))}
              </select>
            </label>

            <label className="campo">
              <span>Valor</span>
              <div className="campo-valor">
                <span>R$</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min="0.01"
                  step="0.01"
                  placeholder="0,00"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  required
                />
              </div>
            </label>

            {saldoInsuficiente && (
              <p className="aviso-inline">
                Esse valor passa do saldo disponível da conta de origem.
              </p>
            )}

            <button type="submit" className="botao-principal" disabled={!podeTransferir}>
              {enviando ? 'Transferindo…' : 'Transferir'}
            </button>

            {mensagem && (
              <div className={`aviso aviso--${mensagem.tipo === 'sucesso' ? 'sucesso' : 'erro'}`}>
                {mensagem.texto}
              </div>
            )}
          </form>
        </section>
      </main>
    </div>
  )
}
