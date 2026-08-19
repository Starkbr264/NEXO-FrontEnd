# BancoNova — Frontend

Interface React (Vite) para o backend Spring Boot do BancoNova. Consome:

- `GET /api/contas` — lista as contas
- `POST /api/transferencias` — realiza uma transferência

## Como rodar

1. Suba o backend primeiro (na pasta `banconova`, projeto Spring Boot):

   ```powershell
   .\mvnw.cmd spring-boot:run
   ```

   Ele fica em `http://localhost:8084`.

2. Em outro terminal, nesta pasta do frontend:

   ```bash
   npm install
   npm run dev
   ```

3. Abra `http://localhost:5173`.

O `vite.config.js` já tem um proxy de `/api` para `http://localhost:8084`,
então o frontend nunca precisa saber a porta do backend nem lidar com CORS —
basta o backend estar rodando.

## O que a tela faz

- Lista as contas cadastradas com nome do titular e saldo.
- Formulário de transferência com conta de origem, conta de destino e valor.
- Mostra a mensagem que o backend devolve (sucesso ou erro) e atualiza os
  saldos na tela depois de cada transferência.
- Um aviso local (antes mesmo de enviar) aparece se o valor digitado for
  maior que o saldo da conta de origem — mas quem decide de fato se a
  transferência é permitida é o backend.

## Observação sobre o backend

O `README.md` original do projeto Spring Boot menciona que a validação de
saldo insuficiente ainda não está implementada em `ContaController.java`
(o saldo pode ficar negativo). Esse frontend já está pronto para exibir
corretamente uma mensagem de erro assim que essa validação for adicionada
no backend — não é necessário mexer em nada aqui.
