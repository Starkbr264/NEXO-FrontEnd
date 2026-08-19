package com.nexo.banconova.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nexo.banconova.dto.TransferenciaRequestDTO;
import com.nexo.banconova.model.Conta;
import com.nexo.banconova.repository.ContaRepository;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ContaController {

    private final ContaRepository contaRepository;

    @Autowired
    public ContaController(ContaRepository contaRepository) {
        this.contaRepository = contaRepository;
    }

    // Ja pronto: lista as contas, para descobrir os ids e saldos de teste.
    @GetMapping("/contas")
    public List<Conta> listarContas() {
        return contaRepository.findAll();
    }

    // CHAMADO DA EQUIPE BACKEND (BancoNova — Fintech):
    // "Hoje o sistema permite tentar transferir mais dinheiro do que a
    // conta tem. Adicionem a validacao de saldo antes de autorizar a
    // transferencia."
    //
    // Como esta agora, o metodo abaixo SEMPRE transfere o valor, mesmo que
    // a conta de origem nao tenha saldo suficiente — o saldo pode ficar
    // negativo. A equipe precisa adicionar a validacao (e devolver um erro
    // claro quando o saldo for insuficiente).
    @PostMapping("/transferencias")
    public ResponseEntity<String> transferir(@RequestBody TransferenciaRequestDTO dto) {
        if (dto.getContaOrigemId() == null || dto.getContaDestinoId() == null || dto.getValor() == null) {
            return ResponseEntity.badRequest().body("Dados da transferencia sao obrigatorios");
        }
        if (dto.getContaOrigemId().equals(dto.getContaDestinoId())) {
            return ResponseEntity.badRequest().body("A conta de origem deve ser diferente da conta de destino");
        }
        if (dto.getValor().compareTo(BigDecimal.ZERO) <= 0) {
            return ResponseEntity.badRequest().body("O valor da transferencia deve ser maior que zero");
        }

        Conta origem = contaRepository.findById(dto.getContaOrigemId())
                .orElseThrow(() -> new RuntimeException("Conta de origem nao encontrada"));
        Conta destino = contaRepository.findById(dto.getContaDestinoId())
                .orElseThrow(() -> new RuntimeException("Conta de destino nao encontrada"));

        if (origem.getSaldo().compareTo(dto.getValor()) < 0) {
            return ResponseEntity.badRequest().body("Saldo insuficiente para realizar a transferencia");
        }

        origem.setSaldo(origem.getSaldo().subtract(dto.getValor()));
        destino.setSaldo(destino.getSaldo().add(dto.getValor()));

        contaRepository.save(origem);
        contaRepository.save(destino);

        return ResponseEntity.ok("Transferencia realizada");
    }
}
