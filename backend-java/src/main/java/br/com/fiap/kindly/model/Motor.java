package br.com.fiap.kindly.model;

public enum Motor {
    C, K, A;

    public static Motor fromCodigo(String codigo) {
        for (Motor m : Motor.values()) {
            if (m.name().equals(codigo)) {
                return m;
            }
        }
        return null;
    }
}
