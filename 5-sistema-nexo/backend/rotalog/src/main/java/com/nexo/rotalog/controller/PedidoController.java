package com.nexo.rotalog.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nexo.rotalog.model.Pedido;
import com.nexo.rotalog.repository.PedidoRepository;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoRepository pedidoRepository;

    @Autowired
    public PedidoController(PedidoRepository pedidoRepository) {
        this.pedidoRepository = pedidoRepository;
    }

    // Ja pronto: lista todos os pedidos, so para referencia/teste.
    // Use isso para descobrir codigos existentes (ex: RL-1001, RL-1002).
    @GetMapping
    public List<Pedido> listar() {
        return pedidoRepository.findAll();
    }

    // CHAMADO DA EQUIPE BACKEND (RotaLog — Rastreamento):
    // "Criem um endpoint GET /pedidos/{codigo}/rastreio que devolva o status
    // atual e o historico de localizacoes do pedido."
    //
    // Este endpoint ainda NAO existe. A equipe precisa:
    // 1. Criar o metodo GET /api/pedidos/{codigo}/rastreio
    // 2. Buscar o pedido pelo codigo usando pedidoRepository.findByCodigo(codigo)
    // 3. Devolver o status atual + o historico (ver Pedido.java)
    // 4. Devolver 404 se o codigo nao existir
    //
    // Dica: o metodo findByCodigo ja existe em PedidoRepository.

}
