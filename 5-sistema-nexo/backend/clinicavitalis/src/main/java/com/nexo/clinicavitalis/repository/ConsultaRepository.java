package com.nexo.clinicavitalis.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nexo.clinicavitalis.model.Consulta;

public interface ConsultaRepository extends JpaRepository<Consulta, Long> {

    List<Consulta> findByMedicoIdAndData(Long medicoId, LocalDate data);
}
