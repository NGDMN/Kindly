package br.com.fiap.kindly.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import br.com.fiap.kindly.model.Motor;
import br.com.fiap.kindly.model.Status;
import br.com.fiap.kindly.model.Usuario;

@Repository
public class UsuarioDao {

    private final JdbcTemplate jdbc;

    @Autowired
    public UsuarioDao(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<Usuario> mapper = (rs, rowNum) -> new Usuario(
            rs.getLong("id"),
            rs.getString("nome"),
            rs.getString("cpf"),
            rs.getString("usuario"),
            rs.getString("senha"),
            Motor.fromCodigo(rs.getString("motor")),
            rs.getBigDecimal("pontuacao_acumulada"),
            Status.fromId(rs.getInt("id_status"))
    );

    public void inserir(Usuario u) {
        String sql = """
                INSERT INTO TB_Usuario (nome, cpf, usuario, senha, motor, pontuacao_acumulada, id_status)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """;
        jdbc.update(sql,
                u.getNome(),
                u.getCpf(),
                u.getUsuario(),
                u.getSenha(),
                u.getMotor() != null ? u.getMotor().name() : null,
                u.getPontuacaoAcumulada(),
                u.getStatus().idBanco
        );
    }

    public List<Usuario> listarAtivos() {
        String sql = "SELECT * FROM TB_Usuario WHERE id_status = 1";
        return jdbc.query(sql, mapper);
    }

    public Optional<Usuario> buscarPorId(Long id) {
        String sql = "SELECT * FROM TB_Usuario WHERE id = ?";
        return jdbc.query(sql, mapper, id).stream().findFirst();
    }

    public Optional<Usuario> buscarPorUsuario(String usuario) {
        String sql = "SELECT * FROM TB_Usuario WHERE usuario = ?";
        return jdbc.query(sql, mapper, usuario).stream().findFirst();
    }

    public void atualizar(Usuario u) {
        String sql = """
                UPDATE TB_Usuario
                SET nome = ?, cpf = ?, usuario = ?, senha = ?, motor = ?, pontuacao_acumulada = ?, id_status = ?
                WHERE id = ?
                """;
        jdbc.update(sql,
                u.getNome(),
                u.getCpf(),
                u.getUsuario(),
                u.getSenha(),
                u.getMotor() != null ? u.getMotor().name() : null,
                u.getPontuacaoAcumulada(),
                u.getStatus().idBanco,
                u.getId()
        );
    }

    public void deletar(Long id) {
        // Soft delete — padrão do projeto
        String sql = "UPDATE TB_Usuario SET id_status = 3 WHERE id = ?";
        jdbc.update(sql, id);
    }
}
