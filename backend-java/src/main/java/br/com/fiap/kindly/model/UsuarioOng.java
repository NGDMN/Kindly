package br.com.fiap.kindly.model;

public class UsuarioOng {

    private Long id;
    private Long idUsuario;
    private Long idOng;
    private Role role;
    private Status status;

    public UsuarioOng() {
    }

    public UsuarioOng(Long id, Long idUsuario, Long idOng, Role role, Status status) {
        this.id = id;
        this.idUsuario = idUsuario;
        this.idOng = idOng;
        this.role = role;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public Long getIdOng() {
        return idOng;
    }

    public void setIdOng(Long idOng) {
        this.idOng = idOng;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }
}
