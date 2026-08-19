# Clínica Vitalis — Sistema de Agendamento

Cliente: **Clínica Vitalis** · Sistema mantido pela NEXO Tecnologia.

## Como rodar

```bash
mvn spring-boot:run
```

Sobe em `http://localhost:8081`.

## Endpoint com o chamado da equipe Backend

```
GET /api/agenda/horarios-disponiveis?medicoId=1&data=2026-08-20
```

Retorna a lista de horários livres do médico naquela data. **Hoje cada
horário aparece duas vezes na resposta** — esse é o chamado: encontrar a
causa e corrigir (o bug está em `AgendaController.java`, comentado no
código).

Médicos de exemplo já cadastrados ao subir a aplicação: id `1` (Dra.
Fernanda Lopes) e id `2` (Dr. Rogério Matos).
