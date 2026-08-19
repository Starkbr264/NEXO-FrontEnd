package com.nexo.eduplus;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.nexo.eduplus.model.Aluno;
import com.nexo.eduplus.model.Curso;
import com.nexo.eduplus.model.Matricula;
import com.nexo.eduplus.repository.AlunoRepository;
import com.nexo.eduplus.repository.CursoRepository;
import com.nexo.eduplus.repository.MatriculaRepository;

@SpringBootApplication
public class EduPlusApplication {

    public static void main(String[] args) {
        SpringApplication.run(EduPlusApplication.class, args);
    }

    @Bean
    CommandLineRunner seed(AlunoRepository alunoRepository, CursoRepository cursoRepository,
                            MatriculaRepository matriculaRepository) {
        return args -> {
            if (alunoRepository.count() == 0) {
                Aluno aluno = alunoRepository.save(new Aluno("Marina Souza"));

                Curso c1 = cursoRepository.save(new Curso("Java para Iniciantes", 40));
                Curso c2 = cursoRepository.save(new Curso("React na Pratica", 30));
                Curso c3 = cursoRepository.save(new Curso("Fundamentos de Banco de Dados", 25));
                Curso c4 = cursoRepository.save(new Curso("Spring Boot Essencial", 35));
                Curso c5 = cursoRepository.save(new Curso("Git e Controle de Versao", 10));

                matriculaRepository.save(new Matricula(aluno, c1, 80));
                matriculaRepository.save(new Matricula(aluno, c2, 45));
                matriculaRepository.save(new Matricula(aluno, c3, 100));
                matriculaRepository.save(new Matricula(aluno, c4, 20));
                matriculaRepository.save(new Matricula(aluno, c5, 100));
            }
        };
    }
}
