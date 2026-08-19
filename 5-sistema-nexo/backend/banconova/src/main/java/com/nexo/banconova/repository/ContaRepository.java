package com.nexo.banconova.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nexo.banconova.model.Conta;

public interface ContaRepository extends JpaRepository<Conta, Long> {
}
