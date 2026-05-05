package br.com.fiap.kindly.model;

import java.math.BigDecimal;

public class Inscricao {

    private Long id;
    private BigDecimal pontuacaoSnap;
    private BigDecimal modificadorSnap;
    private Long idUsuario;
    private Long idOportunidade;
    private StatusInscricao statusInscricao;

    public Inscricao() {
    }

    public Inscricao(Long id, BigDecimal pontuacaoSnap, BigDecimal modificadorSnap, Long idUsuario, Long idOportunidade, StatusInscricao statusInscricao) {
        this.id = id;
        this.pontuacaoSnap = pontuacaoSnap;
        this.modificadorSnap = modificadorSnap;
        this.idUsuario = idUsuario;
        this.idOportunidade = idOportunidade;
        this.statusInscricao = statusInscricao;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getPontuacaoSnap() {
        return pontuacaoSnap;
    }

    public void setPontuacaoSnap(BigDecimal pontuacaoSnap) {
        this.pontuacaoSnap = pontuacaoSnap;
    }

    public BigDecimal getModificadorSnap() {
        return modificadorSnap;
    }

    public void setModificadorSnap(BigDecimal modificadorSnap) {
        this.modificadorSnap = modificadorSnap;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public Long getIdOportunidade() {
        return idOportunidade;
    }

    public void setIdOportunidade(Long idOportunidade) {
        this.idOportunidade = idOportunidade;
    }

    public StatusInscricao getStatusInscricao() {
        return statusInscricao;
    }

    public void setStatusInscricao(StatusInscricao statusInscricao) {
        this.statusInscricao = statusInscricao;
    }

}
