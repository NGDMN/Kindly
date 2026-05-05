package br.com.fiap.kindly.model;

import java.sql.Date;

public class Streak {

    private Long id;
    private Date semanaReferencia;
    private Boolean streakMantida;
    private Integer totalStreak;
    private Long idUsuario;

    public Streak() {
    }

    public Streak(Long id, Date semanaReferencia, Boolean streakMantida, Integer totalStreak, Long idUsuario) {
        this.id = id;
        this.semanaReferencia = semanaReferencia;
        this.streakMantida = streakMantida;
        this.totalStreak = totalStreak;
        this.idUsuario = idUsuario;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getSemanaReferencia() {
        return semanaReferencia;
    }

    public void setSemanaReferencia(Date semanaReferencia) {
        this.semanaReferencia = semanaReferencia;
    }

    public Boolean getStreakMantida() {
        return streakMantida;
    }

    public void setStreakMantida(Boolean streakMantida) {
        this.streakMantida = streakMantida;
    }

    public Integer getTotalStreak() {
        return totalStreak;
    }

    public void setTotalStreak(Integer totalStreak) {
        this.totalStreak = totalStreak;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }
}
