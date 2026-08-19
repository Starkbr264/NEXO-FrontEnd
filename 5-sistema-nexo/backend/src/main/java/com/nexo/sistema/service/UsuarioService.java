package com.nexo.sistema.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nexo.sistema.dto.LoginRequestDTO;
import com.nexo.sistema.dto.UsuarioRequestDTO;
import com.nexo.sistema.dto.UsuarioResponseDTO;
import com.nexo.sistema.exception.RegraDeNegocioException;
import com.nexo.sistema.model.Usuario;
import com.nexo.sistema.repository.UsuarioRepository;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    @Autowired
    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public UsuarioResponseDTO cadastrar(UsuarioRequestDTO dto) {
        if (usuarioRepository.existsByEmail(dto.getEmail())) {
            throw new RegraDeNegocioException("Ja existe um usuario cadastrado com esse email");
        }

        Usuario usuario = new Usuario(dto.getNome(), dto.getEmail(), dto.getSenha());
        Usuario salvo = usuarioRepository.save(usuario);
        return new UsuarioResponseDTO(salvo);
    }

    public List<UsuarioResponseDTO> listar() {
        return usuarioRepository.findAll()
                .stream()
                .map(UsuarioResponseDTO::new)
                .collect(Collectors.toList());
    }

    public UsuarioResponseDTO login(LoginRequestDTO dto) {
        Usuario usuario = usuarioRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RegraDeNegocioException("Email ou senha invalidos"));

        // NOTA: comparacao simples de texto puro, so para a simulacao.
        if (!usuario.getSenha().equals(dto.getSenha())) {
            throw new RegraDeNegocioException("Email ou senha invalidos");
        }

        return new UsuarioResponseDTO(usuario);
    }
}
