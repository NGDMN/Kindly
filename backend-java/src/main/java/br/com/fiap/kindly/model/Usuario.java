package br.com.fiap.kindly.model;

import java.math.BigDecimal;

public class Usuario extends EntidadeBase {

    private String cpf;
    private String usuario;
    private String senha;
    private Motor motor;
    private BigDecimal pontuacaoAcumulada;
    private Status status;

    public Usuario() {
    }

    public Usuario(Long id, String nome, String cpf, String usuario, String senha, Motor motor, BigDecimal pontuacaoAcumulada, Status status) {
        super(id, nome);
        this.cpf = cpf;
        this.usuario = usuario;
        this.senha = senha;
        this.motor = motor;
        this.pontuacaoAcumulada = pontuacaoAcumulada;
        this.status = status;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public Motor getMotor() {
        return motor;
    }

    public void setMotor(Motor motor) {
        this.motor = motor;
    }

    public BigDecimal getPontuacaoAcumulada() {
        return pontuacaoAcumulada;
    }

    public void setPontuacaoAcumulada(BigDecimal pontuacaoAcumulada) {
        this.pontuacaoAcumulada = pontuacaoAcumulada;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }
}
