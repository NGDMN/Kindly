package br.com.fiap.kindly.service;

import java.math.BigDecimal;
import java.sql.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.fiap.kindly.dao.CategoriaDao;
import br.com.fiap.kindly.dao.OngDao;
import br.com.fiap.kindly.dao.OportunidadeDao;
import br.com.fiap.kindly.model.Oportunidade;
import br.com.fiap.kindly.model.Status;

@Service
public class OportunidadeService {

    private final OportunidadeDao oportunidadeDao;
    private final OngDao ongDao;
    private final CategoriaDao categoriaDao;

    @Autowired
    public OportunidadeService(OportunidadeDao oportunidadeDao, OngDao ongDao, CategoriaDao categoriaDao) {
        this.oportunidadeDao = oportunidadeDao;
        this.ongDao = ongDao;
        this.categoriaDao = categoriaDao;
    }

    public void cadastrar(String titulo, String descricao, Date dataEvento,
            BigDecimal localLat, BigDecimal localLong,
            Integer vagasTotal, Long idOng, Long idCategoria) {

        validarCadastro(titulo, descricao, dataEvento, localLat, localLong, vagasTotal);

        ongDao.buscarPorId(idOng)
                .orElseThrow(() -> new IllegalArgumentException("ONG não encontrada."));
        categoriaDao.buscarPorId(idCategoria)
                .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada."));

        Oportunidade nova = new Oportunidade(
                null,
                titulo,
                descricao,
                dataEvento,
                localLat,
                localLong,
                vagasTotal,
                0,
                0,
                idOng,
                idCategoria,
                Status.Ativo
        );
        oportunidadeDao.inserir(nova);
    }

    public List<Oportunidade> listarAtivas() {
        return oportunidadeDao.listarAtivas();
    }

    public List<Oportunidade> listarPorOng(Long idOng) {
        return oportunidadeDao.listarPorOng(idOng);
    }

    public List<Oportunidade> listarPorCategoria(Long idCategoria) {
        return oportunidadeDao.listarPorCategoria(idCategoria);
    }

    public Oportunidade buscarPorId(Long id) {
        return oportunidadeDao.buscarPorId(id)
                .orElseThrow(() -> new IllegalArgumentException("Oportunidade não encontrada."));
    }

    public void atualizar(Long id, String titulo, String descricao, Date dataEvento,
            BigDecimal localLat, BigDecimal localLong,
            Integer vagasTotal, Long idCategoria) {

        Oportunidade existente = buscarPorId(id);
        validarCadastro(titulo, descricao, dataEvento, localLat, localLong, vagasTotal);

        categoriaDao.buscarPorId(idCategoria)
                .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada."));

        existente.setTitulo(titulo);
        existente.setDescricao(descricao);
        existente.setDataEvento(dataEvento);
        existente.setLocalLat(localLat);
        existente.setLocalLong(localLong);
        existente.setVagasTotal(vagasTotal);
        existente.setIdCategoria(idCategoria);
        oportunidadeDao.atualizar(existente);
    }

    public void deletar(Long id) {
        buscarPorId(id); // garante que existe antes de deletar
        oportunidadeDao.deletar(id);
    }

    private void validarCadastro(String titulo, String descricao, Date dataEvento,
            BigDecimal localLat, BigDecimal localLong, Integer vagasTotal) {
        if (titulo == null || titulo.isBlank()) {
            throw new IllegalArgumentException("Título é obrigatório.");
        }
        if (descricao == null || descricao.isBlank()) {
            throw new IllegalArgumentException("Descrição é obrigatória.");
        }
        if (dataEvento == null) {
            throw new IllegalArgumentException("Data do evento é obrigatória.");
        }
        if (localLat == null || localLong == null) {
            throw new IllegalArgumentException("Localização é obrigatória.");
        }
        if (vagasTotal == null || vagasTotal <= 0) {
            throw new IllegalArgumentException("Número de vagas deve ser maior que zero.");
        }
    }
}
