package com.nexo.clinicavitalis.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nexo.clinicavitalis.model.Medico;

public interface MedicoRepository extends JpaRepository<Medico, Long> {
}
