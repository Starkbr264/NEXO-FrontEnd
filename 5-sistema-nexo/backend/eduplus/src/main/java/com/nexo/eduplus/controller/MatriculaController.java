package com.nexo.eduplus.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nexo.eduplus.model.Matricula;
import com.nexo.eduplus.repository.MatriculaRepository;

@RestController
@RequestMapping("/api/alunos")
public class MatriculaController {

    private final MatriculaRepository matriculaRepository;

    @Autowired
    public MatriculaController(MatriculaRepository matriculaRepository) {
        this.matriculaRepository = matriculaRepository;
    }

    // CHAMADO DA EQUIPE BACKEND (EduPlus — Cursos online):
    // "Alunos com muitos cursos matriculados relatam demora para carregar a
    // lista. Proponham uma forma de otimizar essa consulta ao banco."
    //
    // O PROBLEMA: MatriculaRepository.findByAlunoId busca as matriculas,
    // mas cada uma acessa matricula.getCurso().getNome() em um SELECT
    // separado (lazy loading) — isso e um classico problema N+1: para um
    // aluno com 5 cursos, o banco recebe 1 consulta para as matriculas +
    // 5 consultas extras (uma por curso), quando poderia ser so 1 ou 2.
    //
    // A equipe precisa propor a otimizacao: usar JOIN FETCH na query,
    // @EntityGraph, ou outra estrategia para reduzir o numero de consultas.
    @GetMapping("/{alunoId}/cursos")
    public List<Map<String, Object>> cursosDoAluno(@PathVariable Long alunoId) {
        List<Matricula> matriculas = matriculaRepository.findByAlunoId(alunoId);

        return matriculas.stream()
                .map(m -> Map.<String, Object>of(
                        "curso", m.getCurso().getNome(), // dispara 1 SELECT por matricula
                        "cargaHoraria", m.getCurso().getCargaHoraria(),
                        "progresso", m.getProgresso()
                ))
                .collect(Collectors.toList());
    }
}
