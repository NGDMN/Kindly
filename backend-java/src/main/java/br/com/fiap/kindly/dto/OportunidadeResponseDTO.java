package br.com.fiap.kindly.dto;

import java.math.BigDecimal;
import java.sql.Date;

public class OportunidadeResponseDTO {

    private Long id;
    private String titulo;
    private String descricao;
    private Date dataEvento;
    private String endereco;
    private BigDecimal localLat;
    private BigDecimal localLong;
    private Integer vagasTotal;
    private Integer vagasPresente;
    private Long idOng;
    private String nomeOng;
    private Long idCategoria;
    private String nomeCategoria;
    private BigDecimal pontuacao;
    private BigDecimal modificador;

    public OportunidadeResponseDTO() {
    }

    public OportunidadeResponseDTO(Long id, String titulo, String descricao, Date dataEvento, String endereco,
            BigDecimal localLat, BigDecimal localLong,
            Integer vagasTotal, Integer vagasPresente,
            Long idOng, String nomeOng,
            Long idCategoria, String nomeCategoria,
            BigDecimal pontuacao, BigDecimal modificador) {
        this.id = id;
        this.titulo = titulo;
        this.descricao = descricao;
        this.dataEvento = dataEvento;
        this.endereco = endereco;
        this.localLat = localLat;
        this.localLong = localLong;
        this.vagasTotal = vagasTotal;
        this.vagasPresente = vagasPresente;
        this.idOng = idOng;
        this.nomeOng = nomeOng;
        this.idCategoria = idCategoria;
        this.nomeCategoria = nomeCategoria;
        this.pontuacao = pontuacao;
        this.modificador = modificador;
    }

    // Getters e setters
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

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
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

    public Long getIdOng() {
        return idOng;
    }

    public void setIdOng(Long idOng) {
        this.idOng = idOng;
    }

    public String getNomeOng() {
        return nomeOng;
    }

    public void setNomeOng(String nomeOng) {
        this.nomeOng = nomeOng;
    }

    public Long getIdCategoria() {
        return idCategoria;
    }

    public void setIdCategoria(Long idCategoria) {
        this.idCategoria = idCategoria;
    }

    public String getNomeCategoria() {
        return nomeCategoria;
    }

    public void setNomeCategoria(String nomeCategoria) {
        this.nomeCategoria = nomeCategoria;
    }

    public BigDecimal getPontuacao() {
        return pontuacao;
    }

    public void setPontuacao(BigDecimal pontuacao) {
        this.pontuacao = pontuacao;
    }

    public BigDecimal getModificador() {
        return modificador;
    }

    public void setModificador(BigDecimal modificador) {
        this.modificador = modificador;
    }
}
