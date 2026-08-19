package com.nexo.rotalog;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.nexo.rotalog.model.Pedido;
import com.nexo.rotalog.repository.PedidoRepository;

@SpringBootApplication
public class RotaLogApplication {

    public static void main(String[] args) {
        SpringApplication.run(RotaLogApplication.class, args);
    }

    @Bean
    CommandLineRunner seed(PedidoRepository pedidoRepository) {
        return args -> {
            if (pedidoRepository.count() == 0) {
                Pedido p1 = new Pedido("RL-1001", "Saiu para entrega");
                p1.adicionarHistorico("Pedido separado no centro de distribuicao");
                p1.adicionarHistorico("Saiu para entrega");
                pedidoRepository.save(p1);

                Pedido p2 = new Pedido("RL-1002", "Entregue");
                p2.adicionarHistorico("Pedido separado no centro de distribuicao");
                p2.adicionarHistorico("Saiu para entrega");
                p2.adicionarHistorico("Entregue");
                pedidoRepository.save(p2);
            }
        };
    }
}
