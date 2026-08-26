# NEXO Frontend Completo

Frontend React + Vite integrado aos backends existentes em `5-sistema-nexo`.

## Mapeamento das APIs

| Módulo | Backend | Frontend |
|---|---:|---|
| Varejo Fácil | `8080` | login, cadastro, usuários |
| Clínica Vitalis | `8081` | disponibilidade da agenda |
| RotaLog | `8082` | pedidos e histórico |
| EduPlus | `8083` | cursos e progresso |
| BancoNova | `8084` | contas e transferências |

O Vite usa proxy local, então o navegador chama o frontend em `localhost:5173` e o Vite encaminha as requisições para cada backend. Isso evita depender de CORS nos quatro backends que não têm configuração de CORS.

## Como rodar

Abra um terminal nesta pasta:

```powershell
npm install
npm run dev
```

Depois abra:

```text
http://localhost:5173
```

## Backends

Para ter todos os módulos funcionais, deixe os backends ligados:

```text
Varejo Fácil   -> 8080
Clínica Vitalis -> 8081
RotaLog         -> 8082
EduPlus         -> 8083
BancoNova       -> 8084
```

Não é necessário ligar todos ao mesmo tempo para abrir a interface. Os módulos que não conseguirem acessar suas APIs exibem uma mensagem de erro.

## Observações sobre os chamados do backend

- Clínica Vitalis: o backend duplica horários. O frontend deduplica a lista para não mostrar o mesmo horário duas vezes.
- BancoNova: o backend ainda permite saldo negativo. A interface bloqueia valores inválidos, mas a regra de saldo deve continuar sendo validada no backend.
- EduPlus: o endpoint atual é o cenário de N+1 descrito no chamado.
- RotaLog: o endpoint separado `/api/pedidos/{codigo}/rastreio` ainda não existe. O frontend usa o histórico já retornado por `GET /api/pedidos`.

## Estrutura

```text
src/
  App.tsx
  api.ts
  main.tsx
  styles.css
  pages/
    Dashboard.tsx
    Clinic.tsx
    Bank.tsx
    Education.tsx
    Logistics.tsx
    Users.tsx
```
