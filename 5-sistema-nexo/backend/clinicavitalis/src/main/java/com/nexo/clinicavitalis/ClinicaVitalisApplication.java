package com.nexo.clinicavitalis;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.nexo.clinicavitalis.model.Medico;
import com.nexo.clinicavitalis.repository.MedicoRepository;

@SpringBootApplication
public class ClinicaVitalisApplication {

    public static void main(String[] args) {
        SpringApplication.run(ClinicaVitalisApplication.class, args);
    }

    // Carrega um medico de exemplo ao iniciar, para dar algo pronto para testar
    @Bean
    CommandLineRunner seed(MedicoRepository medicoRepository) {
        return args -> {
            if (medicoRepository.count() == 0) {
                medicoRepository.save(new Medico("Dra. Fernanda Lopes", "Clinica Geral"));
                medicoRepository.save(new Medico("Dr. Rogerio Matos", "Pediatria"));
            }
        };
    }
}
