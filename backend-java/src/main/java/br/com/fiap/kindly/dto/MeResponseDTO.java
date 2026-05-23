package br.com.fiap.kindly.dto;

import java.math.BigDecimal;
import java.util.List;

public class MeResponseDTO {

    private Long id;
    private String nome;
    private String usuario;
    private String motor;
    private BigDecimal pontuacaoAcumulada;
    private Integer streakAtual;
    private List<OngVinculoDTO> ongsVinculadas;

    public MeResponseDTO() {
    }

    public MeResponseDTO(Long id, String nome, String usuario, String motor,
            BigDecimal pontuacaoAcumulada, Integer streakAtual,
            List<OngVinculoDTO> ongsVinculadas) {
        this.id = id;
        this.nome = nome;
        this.usuario = usuario;
        this.motor = motor;
        this.pontuacaoAcumulada = pontuacaoAcumulada;
        this.streakAtual = streakAtual;
        this.ongsVinculadas = ongsVinculadas;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getMotor() {
        return motor;
    }

    public void setMotor(String motor) {
        this.motor = motor;
    }

    public BigDecimal getPontuacaoAcumulada() {
        return pontuacaoAcumulada;
    }

    public void setPontuacaoAcumulada(BigDecimal pontuacaoAcumulada) {
        this.pontuacaoAcumulada = pontuacaoAcumulada;
    }

    public Integer getStreakAtual() {
        return streakAtual;
    }

    public void setStreakAtual(Integer streakAtual) {
        this.streakAtual = streakAtual;
    }

    public List<OngVinculoDTO> getOngsVinculadas() {
        return ongsVinculadas;
    }

    public void setOngsVinculadas(List<OngVinculoDTO> ongsVinculadas) {
        this.ongsVinculadas = ongsVinculadas;
    }

    public static class OngVinculoDTO {

        private Long idOng;
        private String nomeFantasia;
        private String role;

        public OngVinculoDTO() {
        }

        public OngVinculoDTO(Long idOng, String nomeFantasia, String role) {
            this.idOng = idOng;
            this.nomeFantasia = nomeFantasia;
            this.role = role;
        }

        public Long getIdOng() {
            return idOng;
        }

        public void setIdOng(Long idOng) {
            this.idOng = idOng;
        }

        public String getNomeFantasia() {
            return nomeFantasia;
        }

        public void setNomeFantasia(String nomeFantasia) {
            this.nomeFantasia = nomeFantasia;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }
    }
}
