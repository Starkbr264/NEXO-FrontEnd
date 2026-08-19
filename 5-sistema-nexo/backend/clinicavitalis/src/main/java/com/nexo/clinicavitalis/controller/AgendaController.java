package com.nexo.clinicavitalis.controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nexo.clinicavitalis.model.Consulta;
import com.nexo.clinicavitalis.repository.ConsultaRepository;

@RestController
@RequestMapping("/api/agenda")
public class AgendaController {

    private static final List<String> HORARIOS_DO_DIA = List.of(
            "08:00", "09:00", "10:00", "11:00", "12:00",
            "13:00", "14:00", "15:00", "16:00", "17:00"
    );

    private final ConsultaRepository consultaRepository;

    @Autowired
    public AgendaController(ConsultaRepository consultaRepository) {
        this.consultaRepository = consultaRepository;
    }

    // CHAMADO DA EQUIPE BACKEND (Clinica Vitalis — Agendamento):
    // "A API esta retornando o mesmo horario de consulta duas vezes na lista
    // de disponibilidade. Encontrem a causa provavel e proponham a correcao."
    //
    // DICA PARA A EQUIPE: rodem este endpoint e reparem no tamanho da lista
    // devolvida. Cada horario aparece duas vezes. O bug esta neste metodo.
    @GetMapping("/horarios-disponiveis")
    public List<String> horariosDisponiveis(
            @RequestParam Long medicoId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data) {

        List<Consulta> consultasDoDia = consultaRepository.findByMedicoIdAndData(medicoId, data);
        List<String> horariosOcupados = consultasDoDia.stream()
                .map(Consulta::getHorario)
                .toList();

        List<String> disponiveis = new ArrayList<>();
        for (String horario : HORARIOS_DO_DIA) {
            if (!horariosOcupados.contains(horario)) {
                disponiveis.add(horario);
            }
        }

        // BUG: esta linha duplica cada horario na lista final.
        // A equipe de Backend precisa encontrar isso e remover.
        disponiveis.addAll(disponiveis);

        return disponiveis;
    }
}
