package br.com.fiap.kindly.model;

public class EntidadeBase {

    protected Long id;
    protected String nome;

    public EntidadeBase() {
    }

    public EntidadeBase(Long id, String nome) {
        this.id = id;
        this.nome = nome;
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

    public void exibirInfo() {
        System.out.println("Entidade: " + nome + " (ID: " + id + ")");
    }
}
