# BancoNova — Aplicativo Financeiro

Cliente: **BancoNova** · Sistema mantido pela NEXO Tecnologia.

## Como rodar

No Windows, abra um novo terminal depois de configurar o Java e execute:

```powershell
.\mvnw.cmd spring-boot:run
```

O projeto requer Java 20. O Maven Wrapper (`mvnw.cmd`) baixa e usa a versão
correta do Maven automaticamente, portanto não é necessário instalar `mvn`
globalmente.

## Frontend React

O frontend fica em `banconova-frontend` e é um projeto Vite (não Expo).

Para desenvolver com atualização automática, deixe o backend rodando na porta
`8084` e, em outro terminal:

```powershell
cd banconova-frontend
npm install
npm start
```

Abra `http://localhost:5173`. O Vite encaminha as chamadas `/api` para o
backend.

Para publicar React junto ao backend, execute primeiro `npm run build` dentro
de `banconova-frontend`; em seguida inicie o Spring Boot. A interface será
servida em `http://localhost:8084`.

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
