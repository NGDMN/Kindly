package br.com.fiap.kindly.model;

public enum StatusInscricao {
    Inscrito(1),
    Realizado(2),
    Expirado(3),
    Cancelado(4);

    public final int idBanco;

    private StatusInscricao(int idBanco) {
        this.idBanco = idBanco;
    }

    public static StatusInscricao fromId(int id) {
        for (StatusInscricao r : StatusInscricao.values()) {
            if (r.idBanco == id) {
                return r;
            }
        }
        return null;
    }
}
