package com.nexo.eduplus.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nexo.eduplus.model.Aluno;

public interface AlunoRepository extends JpaRepository<Aluno, Long> {
}
