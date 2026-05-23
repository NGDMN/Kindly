package br.com.fiap.kindly.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.fiap.kindly.dao.OngDao;
import br.com.fiap.kindly.dao.UsuarioDao;
import br.com.fiap.kindly.dao.UsuarioOngDao;
import br.com.fiap.kindly.dto.MeResponseDTO;
import br.com.fiap.kindly.dto.RankingItemDTO;
import br.com.fiap.kindly.model.Motor;
import br.com.fiap.kindly.model.ONG;
import br.com.fiap.kindly.model.Status;
import br.com.fiap.kindly.model.Usuario;
import br.com.fiap.kindly.model.UsuarioOng;

@Service
public class UsuarioService {

    private final UsuarioDao usuarioDao;
    private final UsuarioOngDao usuarioOngDao;
    private final OngDao ongDao;
    private final StreakService streakService;

    @Autowired
    public UsuarioService(UsuarioDao usuarioDao,
            UsuarioOngDao usuarioOngDao,
            OngDao ongDao,
            StreakService streakService) {
        this.usuarioDao = usuarioDao;
        this.usuarioOngDao = usuarioOngDao;
        this.ongDao = ongDao;
        this.streakService = streakService;
    }

    public void cadastrar(String nome, String cpf, String usuario, String senha, Motor motor) {
        validarCadastro(nome, cpf, usuario, senha);

        if (usuarioDao.buscarPorUsuario(usuario).isPresent()) {
            throw new IllegalArgumentException("Nome de usuário já está em uso.");
        }

        if (usuarioDao.buscarPorCpf(cpf).isPresent()) {
            throw new IllegalArgumentException("CPF já cadastrado.");
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

    public MeResponseDTO obterMeusDados(Long idUsuario) {
        Usuario u = buscarPorId(idUsuario);

        List<MeResponseDTO.OngVinculoDTO> vinculos = new ArrayList<>();
        List<UsuarioOng> vinculosUsuario = usuarioOngDao.listarPorUsuario(idUsuario);

        for (UsuarioOng vinculo : vinculosUsuario) {
            Optional<ONG> ongOpt = ongDao.buscarPorId(vinculo.getIdOng());
            if (ongOpt.isPresent()) {
                ONG ong = ongOpt.get();
                vinculos.add(new MeResponseDTO.OngVinculoDTO(
                        ong.getId(),
                        ong.getNomeFantasia(),
                        vinculo.getRole() != null ? vinculo.getRole().name() : null
                ));
            }
        }

        int streakAtual = streakService.buscarTotalAtual(idUsuario);

        MeResponseDTO dto = new MeResponseDTO();
        dto.setId(u.getId());
        dto.setNome(u.getNome());
        dto.setUsuario(u.getUsuario());
        dto.setMotor(u.getMotor() != null ? u.getMotor().name() : null);
        dto.setPontuacaoAcumulada(u.getPontuacaoAcumulada());
        dto.setStreakAtual(streakAtual);
        dto.setOngsVinculadas(vinculos);
        return dto;
    }

    public List<RankingItemDTO> obterRanking() {
        List<Usuario> top = usuarioDao.listarTopRanking(10);
        List<RankingItemDTO> ranking = new ArrayList<>();
        int posicao = 1;
        for (Usuario u : top) {
            RankingItemDTO item = new RankingItemDTO();
            item.setPosicao(posicao++);
            item.setIdUsuario(u.getId());
            item.setNome(u.getNome());
            item.setUsuario(u.getUsuario());
            item.setPontuacaoAcumulada(u.getPontuacaoAcumulada());
            ranking.add(item);
        }
        return ranking;
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
