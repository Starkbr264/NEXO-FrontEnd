package com.nexo.banconova;

import java.math.BigDecimal;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.nexo.banconova.model.Conta;
import com.nexo.banconova.repository.ContaRepository;

@SpringBootApplication
public class BancoNovaApplication {

    public static void main(String[] args) {
        SpringApplication.run(BancoNovaApplication.class, args);
    }

    @Bean
    CommandLineRunner seed(ContaRepository contaRepository) {
        return args -> {
            if (contaRepository.count() == 0) {
                contaRepository.save(new Conta("Bruno Almeida", new BigDecimal("500.00")));
                contaRepository.save(new Conta("Carolina Reis", new BigDecimal("120.00")));
            }
        };
    }
}
