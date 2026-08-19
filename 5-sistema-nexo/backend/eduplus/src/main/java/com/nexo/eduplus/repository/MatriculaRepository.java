package com.nexo.eduplus.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nexo.eduplus.model.Matricula;

public interface MatriculaRepository extends JpaRepository<Matricula, Long> {

    // Usado no endpoint de listagem de cursos do aluno.
    // Repara que este metodo, sozinho, nao carrega os dados do Curso de
    // forma otimizada — cada Matricula acessa curso.getNome() separadamente.
    List<Matricula> findByAlunoId(Long alunoId);
}
