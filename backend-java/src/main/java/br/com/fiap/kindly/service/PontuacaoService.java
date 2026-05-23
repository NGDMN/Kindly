package br.com.fiap.kindly.service;

import java.math.BigDecimal;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import br.com.fiap.kindly.dao.InscricaoDao;
import br.com.fiap.kindly.dao.OportunidadeDao;
import br.com.fiap.kindly.model.Oportunidade;

@Service
public class PontuacaoService {

    private final OportunidadeDao oportunidadeDao;
    private final InscricaoDao inscricaoDao;
    private final RestTemplate restTemplate;

    @Value("${python.service.url}")
    private String pythonServiceUrl;

    public PontuacaoService(OportunidadeDao oportunidadeDao,
            InscricaoDao inscricaoDao,
            RestTemplate restTemplate) {
        this.oportunidadeDao = oportunidadeDao;
        this.inscricaoDao = inscricaoDao;
        this.restTemplate = restTemplate;
    }

    /**
     * Calcula pontuação e modificador de uma oportunidade via serviço Python.
     * Em caso de falha do Python, devolve fallback (1.0, 1.0) para não quebrar
     * a listagem inteira.
     *
     * Em produção: adicionar @Cacheable("pontuacao") com TTL de 1 hora.
     */
    public BigDecimal[] calcular(Long idOportunidade) {
        Oportunidade op = oportunidadeDao.buscarPorId(idOportunidade)
                .orElseThrow(() -> new IllegalArgumentException("Oportunidade não encontrada."));

        try {
            long inscritosCategoria = inscricaoDao.listarPorOportunidade(idOportunidade).size();
            long oportunidadesCategoria = oportunidadeDao.listarPorCategoria(op.getIdCategoria()).size();

            Map<String, Object> payload = Map.of(
                    "idOportunidade", idOportunidade,
                    "vagasTotal", op.getVagasTotal(),
                    "vagasPresente", op.getVagasPresente(),
                    "quantidadeInscritosRecentesCategoria", inscritosCategoria,
                    "quantidadeOportunidadesRecentesCategoria", oportunidadesCategoria
            );

            Map resposta = restTemplate.postForObject(
                    pythonServiceUrl + "/calcular-pontuacao",
                    payload,
                    Map.class
            );

            BigDecimal pontuacao = new BigDecimal(resposta.get("pontuacao").toString());
            BigDecimal modificador = new BigDecimal(resposta.get("modificador").toString());
            return new BigDecimal[]{pontuacao, modificador};

        } catch (Exception e) {
            // Fallback: pontuação base mínima, sem modificador
            // Decisão consciente: listagem não pode quebrar se Python estiver fora
            return new BigDecimal[]{BigDecimal.ONE, BigDecimal.ONE};
        }
    }
}
