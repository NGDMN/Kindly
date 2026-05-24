package br.com.fiap.kindly.model;

import java.math.BigDecimal;
import java.sql.Date;

public class Oportunidade {

    private Long id;
    private String titulo;
    private String descricao;
    private Date dataEvento;
    private String endereco;
    private BigDecimal localLat;
    private BigDecimal localLong;
    private Integer vagasTotal;
    private Integer vagasPresente;
    private Integer vagasNoShow;
    private Long idOng;
    private Long idCategoria;
    private Status status;

    public Oportunidade() {
    }

    public Oportunidade(Long id, String titulo, String descricao, Date dataEvento, String endereco, BigDecimal localLat, BigDecimal localLong, Integer vagasTotal, Integer vagasPresente, Integer vagasNoShow, Long idOng, Long idCategoria, Status status) {
        this.id = id;
        this.titulo = titulo;
        this.descricao = descricao;
        this.dataEvento = dataEvento;
        this.endereco = endereco;
        this.localLat = localLat;
        this.localLong = localLong;
        this.vagasTotal = vagasTotal;
        this.vagasPresente = vagasPresente;
        this.vagasNoShow = vagasNoShow;
        this.idOng = idOng;
        this.idCategoria = idCategoria;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getEndereco(){
        return endereco;
    }

    public void setEndereco(String endereco){
        this.endereco = endereco;
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

    public Integer getVagasPresente() {
        return vagasPresente;
    }

    public void setVagasPresente(Integer vagasPresente) {
        this.vagasPresente = vagasPresente;
    }

    public Integer getVagasNoShow() {
        return vagasNoShow;
    }

    public void setVagasNoShow(Integer vagasNoShow) {
        this.vagasNoShow = vagasNoShow;
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

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }
}
