# RotaLog — Sistema de Rastreamento

Cliente: **RotaLog** · Sistema mantido pela NEXO Tecnologia.

## Como rodar

```bash
mvn spring-boot:run
```

Sobe em `http://localhost:8082`.

## O que já funciona

```
GET /api/pedidos
```
Lista todos os pedidos cadastrados (já vem com `RL-1001` e `RL-1002` de
exemplo). Use para descobrir códigos existentes.

## Chamado da equipe Backend

Falta criar:
```
GET /api/pedidos/{codigo}/rastreio
```
Deve devolver o status atual e o histórico de localizações do pedido, e
responder 404 se o código não existir. Veja as instruções comentadas em
`PedidoController.java`.
