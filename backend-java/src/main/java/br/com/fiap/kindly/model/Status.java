package br.com.fiap.kindly.model;

public enum Status {
    Ativo(1),
    Inativo(2),
    Deletado(3);

    public final int idBanco;

    private Status(int idBanco) {
        this.idBanco = idBanco;
    }

    public static Status fromId(int id) {
        for (Status r : Status.values()) {
            if (r.idBanco == id) {
                return r;
            }
        }
        return null;
    }
}
