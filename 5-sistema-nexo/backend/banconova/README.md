# BancoNova — Aplicativo Financeiro

Cliente: **BancoNova** · Sistema mantido pela NEXO Tecnologia.

## Como rodar

```bash
mvn spring-boot:run
```

Sobe em `http://localhost:8084`. Já tem duas contas de exemplo: id `1`
(Bruno Almeida, saldo R$ 500,00) e id `2` (Carolina Reis, saldo R$ 120,00).

## Endpoint com o chamado da equipe Backend

```
POST /api/transferencias
Content-Type: application/json

{
  "contaOrigemId": 2,
  "contaDestinoId": 1,
  "valor": 999.00
}
```

Testem esse exemplo (transferindo mais do que a Carolina tem) — hoje o
sistema deixa passar e o saldo dela fica negativo. O chamado é adicionar
a validação antes de autorizar a transferência. Veja os comentários em
`ContaController.java`.
