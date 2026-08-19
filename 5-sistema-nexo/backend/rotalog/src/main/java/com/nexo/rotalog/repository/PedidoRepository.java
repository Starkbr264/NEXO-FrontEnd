package com.nexo.rotalog.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nexo.rotalog.model.Pedido;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    Optional<Pedido> findByCodigo(String codigo);
}
