# NEXO Tecnologia — Sistema de Usuários

Este é o sistema real que a NEXO mantém em produção. É a base que as equipes de
**Backend** e **Frontend** vão evoluir durante a simulação — os chamados do
quadro (validações, novos endpoints, telas, otimizações) são para serem
resolvidos **em cima deste código**, não do zero.

- **Backend:** Java 20 + Spring Boot 3.2 + Maven + banco H2 (arquivo local, não
  precisa instalar nada)
- **Frontend:** React 18 + TypeScript + Vite

---

## Pré-requisitos

| Ferramenta | Versão | Para quê |
|---|---|---|
| JDK | 20 | rodar o backend |
| Maven | qualquer recente (ou usar o `mvnw` se preferirem adicionar depois) | compilar o backend |
| Node.js | 18+ | rodar o frontend |
| VS Code | — | editor recomendado |

Extensões recomendadas no VS Code:
- **Extension Pack for Java** (Microsoft)
- **Spring Boot Extension Pack** (VMware)
- **ES7+ React/Redux/React-Native snippets** (opcional, para o frontend)

---

## Como rodar o backend

```bash
cd backend
mvn spring-boot:run
```

Ou, pelo VS Code: abra a pasta `backend`, espere o Java Extension Pack indexar o
projeto, abra `SistemaApplication.java` e clique em **Run**.

A API sobe em `http://localhost:8080`. O banco H2 é criado automaticamente em
`backend/data/nexodb` na primeira execução — ninguém precisa instalar
PostgreSQL, MySQL nem nada parecido.

Console do banco (opcional, para inspecionar os dados): `http://localhost:8080/h2-console`
(JDBC URL: `jdbc:h2:file:./data/nexodb`, usuário `sa`, senha em branco).

### Endpoints disponíveis

| Método | Rota | O que faz |
|---|---|---|
| POST | `/api/usuarios` | Cadastra um usuário (`nome`, `email`, `senha`) |
| GET | `/api/usuarios` | Lista todos os usuários (sem a senha) |
| POST | `/api/auth/login` | Faz login (`email`, `senha`) |

Exemplo de cadastro via terminal:

```bash
curl -X POST http://localhost:8080/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{"nome":"Ana Teste","email":"ana@nexo.com","senha":"123456"}'
```

---

## Como rodar o frontend

```bash
cd frontend
npm install
npm run dev
```

Abre em `http://localhost:5173`. Ele já está configurado para conversar com o
backend em `http://localhost:8080` — **o backend precisa estar rodando** para
as telas funcionarem.

Telas disponíveis: **Entrar** (login), **Cadastrar** (novo usuário) e
**Usuários** (lista todo mundo cadastrado).

---

## Estrutura do projeto

```
backend/
  src/main/java/com/nexo/sistema/
    controller/     -> endpoints REST (UsuarioController, AuthController)
    service/        -> regras de negócio (UsuarioService)
    repository/      -> acesso ao banco (UsuarioRepository)
    model/          -> entidade JPA (Usuario)
    dto/            -> objetos de entrada/saída da API
    exception/      -> tratamento de erros
    config/         -> configuração de CORS

frontend/
  src/
    pages/          -> telas (Login, Register, UsersList)
    api.ts          -> chamadas para o backend
    App.tsx         -> navegação
    styles.css      -> identidade visual da NEXO
```

---

## O que já funciona (produção atual)

- Cadastro de usuário com validação de nome, e-mail e senha (mínimo 6 caracteres)
- Bloqueio de e-mail duplicado
- Login simples por e-mail e senha
- Listagem de usuários cadastrados

## Pontos em aberto (chamados reais para as equipes)

Estes são propositalmente deixados como estão — combinam com os chamados do
quadro da equipe:

- **Segurança:** a senha é salva em texto puro no banco (veja o comentário em
  `Usuario.java`). Um chamado de verdade seria trocar isso por hash (ex:
  BCrypt via Spring Security).
- **Login:** não gera token nenhum, só confirma que o e-mail e a senha batem.
  Um chamado de infraestrutura seria adicionar autenticação JWT.
- **Performance:** a listagem de usuários (`GET /api/usuarios`) traz todo
  mundo de uma vez, sem paginação — mesmo tipo de problema do chamado da
  EduPlus sobre lista lenta.
- **Frontend:** as telas não têm nenhuma validação de formato de e-mail antes
  de enviar pro backend — hoje quem valida é só a API.

Fiquem à vontade para abrir chamados novos no quadro da equipe conforme forem
mexendo no código e encontrando mais coisas para melhorar — é assim que
funciona a manutenção de um sistema de verdade.
