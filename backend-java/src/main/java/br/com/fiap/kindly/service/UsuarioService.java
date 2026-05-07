package br.com.fiap.kindly.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.fiap.kindly.dao.UsuarioDao;
import br.com.fiap.kindly.model.Motor;
import br.com.fiap.kindly.model.Status;
import br.com.fiap.kindly.model.Usuario;

@Service
public class UsuarioService {

    private final UsuarioDao usuarioDao;

    @Autowired
    public UsuarioService(UsuarioDao usuarioDao) {
        this.usuarioDao = usuarioDao;
    }

    public void cadastrar(String nome, String cpf, String usuario, String senha, Motor motor) {
        validarCadastro(nome, cpf, usuario, senha);

        if (usuarioDao.buscarPorUsuario(usuario).isPresent()) {
            throw new IllegalArgumentException("Nome de usuário já está em uso.");
        }

        Usuario novoUsuario = new Usuario(
                null,
                nome,
                cpf,
                usuario,
                senha,
                motor,
                BigDecimal.ZERO,
                Status.Ativo
        );
        usuarioDao.inserir(novoUsuario);
    }

    public List<Usuario> listarAtivos() {
        return usuarioDao.listarAtivos();
    }

    public Usuario buscarPorId(Long id) {
        return usuarioDao.buscarPorId(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));
    }

    public Usuario buscarPorUsuario(String usuario) {
        return usuarioDao.buscarPorUsuario(usuario)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));
    }

    public void atualizar(Long id, String nome, String cpf, String usuario, String senha, Motor motor) {
        Usuario existente = buscarPorId(id);
        validarCadastro(nome, cpf, usuario, senha);

        Optional<Usuario> conflito = usuarioDao.buscarPorUsuario(usuario);
        if (conflito.isPresent() && !conflito.get().getId().equals(id)) {
            throw new IllegalArgumentException("Nome de usuário já está em uso.");
        }

        existente.setNome(nome);
        existente.setCpf(cpf);
        existente.setUsuario(usuario);
        existente.setSenha(senha);
        existente.setMotor(motor);
        usuarioDao.atualizar(existente);
    }

    public void deletar(Long id) {
        buscarPorId(id); // garante que existe antes de deletar
        usuarioDao.deletar(id);
    }

    private void validarCadastro(String nome, String cpf, String usuario, String senha) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }
        if (cpf == null || cpf.length() != 11) {
            throw new IllegalArgumentException("CPF inválido.");
        }
        if (usuario == null || usuario.isBlank()) {
            throw new IllegalArgumentException("Nome de usuário é obrigatório.");
        }
        if (senha == null || senha.isBlank()) {
            throw new IllegalArgumentException("Senha é obrigatória.");
        }
    }
}
