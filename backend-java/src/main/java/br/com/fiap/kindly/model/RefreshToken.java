package br.com.fiap.kindly.model;

import java.time.Instant;

public class RefreshToken {

    private Long id;
    private String token;
    private Long idUsuario;
    private Instant expiracao;

    public RefreshToken() {
    }

    public RefreshToken(Long id, String token, Long idUsuario, Instant expiracao) {
        this.id = id;
        this.token = token;
        this.idUsuario = idUsuario;
        this.expiracao = expiracao;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public Instant getExpiracao() {
        return expiracao;
    }

    public void setExpiracao(Instant expiracao) {
        this.expiracao = expiracao;
    }
}
