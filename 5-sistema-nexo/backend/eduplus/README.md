# EduPlus — Plataforma de Cursos

Cliente: **EduPlus** · Sistema mantido pela NEXO Tecnologia.

## Como rodar

```bash
mvn spring-boot:run
```

Sobe em `http://localhost:8083`. Já tem um aluno de exemplo (id `1`,
Marina Souza) matriculado em 5 cursos.

## Endpoint com o chamado da equipe Backend

```
GET /api/alunos/1/cursos
```

Funciona, mas é lento: olhem o console do terminal enquanto chamam esse
endpoint — vocês vão ver vários `SELECT` separados sendo disparados (um
problema clássico de N+1). O chamado é propor e aplicar a otimização.
Veja os comentários em `MatriculaController.java`.
