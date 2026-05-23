package br.com.fiap.kindly.dto;

import java.math.BigDecimal;

public class RankingItemDTO {

    private Integer posicao;
    private Long idUsuario;
    private String nome;
    private String usuario;
    private BigDecimal pontuacaoAcumulada;

    public RankingItemDTO() {
    }

    public RankingItemDTO(Integer posicao, Long idUsuario, String nome, String usuario, BigDecimal pontuacaoAcumulada) {
        this.posicao = posicao;
        this.idUsuario = idUsuario;
        this.nome = nome;
        this.usuario = usuario;
        this.pontuacaoAcumulada = pontuacaoAcumulada;
    }

    public Integer getPosicao() {
        return posicao;
    }

    public void setPosicao(Integer posicao) {
        this.posicao = posicao;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public BigDecimal getPontuacaoAcumulada() {
        return pontuacaoAcumulada;
    }

    public void setPontuacaoAcumulada(BigDecimal pontuacaoAcumulada) {
        this.pontuacaoAcumulada = pontuacaoAcumulada;
    }
}
