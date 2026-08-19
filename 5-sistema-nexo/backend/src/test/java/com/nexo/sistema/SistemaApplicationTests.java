package com.nexo.sistema;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.nexo.sistema.dto.UsuarioRequestDTO;
import com.nexo.sistema.dto.UsuarioResponseDTO;
import com.nexo.sistema.exception.RegraDeNegocioException;
import com.nexo.sistema.service.UsuarioService;

@SpringBootTest
class SistemaApplicationTests {

    @Autowired
    private UsuarioService usuarioService;

    @Test
    void contextLoads() {
    }

    @Test
    void deveCadastrarUsuarioComSucesso() {
        UsuarioRequestDTO dto = new UsuarioRequestDTO();
        dto.setNome("Aluno Teste");
        dto.setEmail("aluno.teste@nexo.com");
        dto.setSenha("senha123");

        UsuarioResponseDTO criado = usuarioService.cadastrar(dto);

        assertThat(criado.getId()).isNotNull();
        assertThat(criado.getEmail()).isEqualTo("aluno.teste@nexo.com");
    }

    @Test
    void naoDeveCadastrarEmailDuplicado() {
        UsuarioRequestDTO dto = new UsuarioRequestDTO();
        dto.setNome("Primeiro");
        dto.setEmail("duplicado@nexo.com");
        dto.setSenha("senha123");
        usuarioService.cadastrar(dto);

        UsuarioRequestDTO dto2 = new UsuarioRequestDTO();
        dto2.setNome("Segundo");
        dto2.setEmail("duplicado@nexo.com");
        dto2.setSenha("outrasenha");

        assertThatThrownBy(() -> usuarioService.cadastrar(dto2))
                .isInstanceOf(RegraDeNegocioException.class);
    }
}
