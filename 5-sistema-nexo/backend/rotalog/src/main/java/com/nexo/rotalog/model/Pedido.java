package com.nexo.rotalog.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String codigo;

    private String statusAtual;

    @ElementCollection
    @CollectionTable(name = "pedido_historico", joinColumns = @jakarta.persistence.JoinColumn(name = "pedido_id"))
    @Column(name = "evento")
    private List<String> historico = new ArrayList<>();

    public Pedido() {
    }

    public Pedido(String codigo, String statusAtual) {
        this.codigo = codigo;
        this.statusAtual = statusAtual;
    }

    public void adicionarHistorico(String evento) {
        this.historico.add(evento);
    }

    public Long getId() {
        return id;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getStatusAtual() {
        return statusAtual;
    }

    public void setStatusAtual(String statusAtual) {
        this.statusAtual = statusAtual;
    }

    public List<String> getHistorico() {
        return historico;
    }
}
