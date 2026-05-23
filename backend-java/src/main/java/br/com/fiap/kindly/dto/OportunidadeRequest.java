package br.com.fiap.kindly.dto;

import java.math.BigDecimal;
import java.sql.Date;

public class OportunidadeRequest {

    private String titulo;
    private String descricao;
    private Date dataEvento;
    private BigDecimal localLat;
    private BigDecimal localLong;
    private Integer vagasTotal;
    private Long idOng;
    private Long idCategoria;

    public OportunidadeRequest() {
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Date getDataEvento() {
        return dataEvento;
    }

    public void setDataEvento(Date dataEvento) {
        this.dataEvento = dataEvento;
    }

    public BigDecimal getLocalLat() {
        return localLat;
    }

    public void setLocalLat(BigDecimal localLat) {
        this.localLat = localLat;
    }

    public BigDecimal getLocalLong() {
        return localLong;
    }

    public void setLocalLong(BigDecimal localLong) {
        this.localLong = localLong;
    }

    public Integer getVagasTotal() {
        return vagasTotal;
    }

    public void setVagasTotal(Integer vagasTotal) {
        this.vagasTotal = vagasTotal;
    }

    public Long getIdOng() {
        return idOng;
    }

    public void setIdOng(Long idOng) {
        this.idOng = idOng;
    }

    public Long getIdCategoria() {
        return idCategoria;
    }

    public void setIdCategoria(Long idCategoria) {
        this.idCategoria = idCategoria;
    }
}
