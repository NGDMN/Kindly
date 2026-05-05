package br.com.fiap.kindly.model;

public enum Role {
    Responsavel(1),
    Administrador(2);

    public final int idBanco;

    private Role(int idBanco) {
        this.idBanco = idBanco;
    }

    public static Role fromId(int id) {
        for (Role r : Role.values()) {
            if (r.idBanco == id) {
                return r;
            }
        }
        return null;
    }
}
