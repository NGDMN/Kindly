package br.com.fiap.kindly.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.fiap.kindly.dao.InscricaoDao;
import br.com.fiap.kindly.dao.OportunidadeDao;
import br.com.fiap.kindly.dao.UsuarioDao;
import br.com.fiap.kindly.model.Inscricao;
import br.com.fiap.kindly.model.StatusInscricao;
import br.com.fiap.kindly.model.Usuario;

@Service
public class InscricaoService {

    private final InscricaoDao inscricaoDao;
    private final OportunidadeDao oportunidadeDao;
    private final UsuarioDao usuarioDao;
    private final StreakService streakService;
    private final PontuacaoService pontuacaoService;

    @Autowired
    public InscricaoService(InscricaoDao inscricaoDao,
            OportunidadeDao oportunidadeDao,
            UsuarioDao usuarioDao,
            StreakService streakService,
            PontuacaoService pontuacaoService) {
        this.inscricaoDao = inscricaoDao;
        this.oportunidadeDao = oportunidadeDao;
        this.usuarioDao = usuarioDao;
        this.streakService = streakService;
        this.pontuacaoService = pontuacaoService;
    }

    public void inscrever(Long idUsuario, Long idOportunidade) {
        oportunidadeDao.buscarPorId(idOportunidade)
                .orElseThrow(() -> new IllegalArgumentException("Oportunidade não encontrada."));

        usuarioDao.buscarPorId(idUsuario)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));

        boolean jaInscrito = inscricaoDao.listarPorUsuario(idUsuario).stream()
                .anyMatch(i -> i.getIdOportunidade().equals(idOportunidade)
                && i.getStatusInscricao() == StatusInscricao.Inscrito);

        if (jaInscrito) {
            throw new IllegalArgumentException("Usuário já inscrito nesta oportunidade.");
        }

        BigDecimal[] snapshot = pontuacaoService.calcular(idOportunidade);
        BigDecimal pontuacaoSnap = snapshot[0];
        BigDecimal modificadorSnap = snapshot[1];

        Inscricao nova = new Inscricao(
                null,
                pontuacaoSnap,
                modificadorSnap,
                idUsuario,
                idOportunidade,
                StatusInscricao.Inscrito
        );
        inscricaoDao.inserir(nova);
    }

    public void confirmarPresenca(Long idInscricao) {
        Inscricao inscricao = inscricaoDao.buscarPorId(idInscricao)
                .orElseThrow(() -> new IllegalArgumentException("Inscrição não encontrada."));

        if (inscricao.getStatusInscricao() != StatusInscricao.Inscrito) {
            throw new IllegalStateException("Inscrição não está em estado válido para confirmação.");
        }

        inscricaoDao.atualizarStatus(idInscricao, StatusInscricao.Realizado);

        creditarPontos(inscricao);
        streakService.registrarSemana(inscricao.getIdUsuario(), true);
    }

    public void expirar(Long idInscricao) {
        Inscricao inscricao = inscricaoDao.buscarPorId(idInscricao)
                .orElseThrow(() -> new IllegalArgumentException("Inscrição não encontrada."));

        if (inscricao.getStatusInscricao() != StatusInscricao.Inscrito) {
            throw new IllegalStateException("Inscrição não está em estado válido para expiração.");
        }

        inscricaoDao.atualizarStatus(idInscricao, StatusInscricao.Expirado);

        debitarPontos(inscricao);
        streakService.registrarSemana(inscricao.getIdUsuario(), false);
    }

    public List<Inscricao> listarPorUsuario(Long idUsuario) {
        return inscricaoDao.listarPorUsuario(idUsuario);
    }

    public List<Inscricao> listarPorOportunidade(Long idOportunidade) {
        return inscricaoDao.listarPorOportunidade(idOportunidade);
    }

    private void creditarPontos(Inscricao inscricao) {
        Usuario usuario = usuarioDao.buscarPorId(inscricao.getIdUsuario())
                .orElseThrow(() -> new IllegalStateException("Usuário não encontrado."));

        BigDecimal pontuacao = inscricao.getPontuacaoSnap()
                .multiply(inscricao.getModificadorSnap());

        usuario.setPontuacaoAcumulada(
                usuario.getPontuacaoAcumulada().add(pontuacao)
        );
        usuarioDao.atualizar(usuario);
    }

    private void debitarPontos(Inscricao inscricao) {
        Usuario usuario = usuarioDao.buscarPorId(inscricao.getIdUsuario())
                .orElseThrow(() -> new IllegalStateException("Usuário não encontrado."));

        BigDecimal pontuacao = inscricao.getPontuacaoSnap()
                .multiply(inscricao.getModificadorSnap());

        usuario.setPontuacaoAcumulada(
                usuario.getPontuacaoAcumulada().subtract(pontuacao)
        );
        usuarioDao.atualizar(usuario);
    }

    public void cancelar(Long idInscricao, Long idUsuario) {
        Inscricao inscricao = inscricaoDao.buscarPorId(idInscricao)
                .orElseThrow(() -> new IllegalArgumentException("Inscrição não encontrada."));

        // Apenas o próprio usuário pode cancelar sua inscrição
        if (!inscricao.getIdUsuario().equals(idUsuario)) {
            throw new IllegalArgumentException("Você só pode cancelar suas próprias inscrições.");
        }

        // Só faz sentido cancelar inscrições ainda ativas (Inscrito)
        if (inscricao.getStatusInscricao() != StatusInscricao.Inscrito) {
            throw new IllegalStateException("Inscrição não pode ser cancelada neste estado.");
        }

        inscricaoDao.cancelar(idInscricao);
        // Cancelamento voluntário não debita pontos nem quebra streak —
        // diferente de Expirado, que pune o no-show.
    }
}
