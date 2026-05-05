package br.com.fiap.kindly.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import br.com.fiap.kindly.model.Role;
import br.com.fiap.kindly.model.Status;
import br.com.fiap.kindly.model.UsuarioOng;

@Repository
public class UsuarioOngDao {

    private final JdbcTemplate jdbc;

    @Autowired
    public UsuarioOngDao(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<UsuarioOng> mapper = (rs, rowNum) -> new UsuarioOng(
            rs.getLong("id"),
            rs.getLong("id_usuario"),
            rs.getLong("id_ong"),
            Role.fromId(rs.getInt("id_role")),
            Status.fromId(rs.getInt("id_status"))
    );

    public void inserir(UsuarioOng uo) {
        String sql = """
                INSERT INTO TB_Usuario_ONG (id_usuario, id_ong, id_role, id_status)
                VALUES (?, ?, ?, ?)
                """;
        jdbc.update(sql,
                uo.getIdUsuario(),
                uo.getIdOng(),
                uo.getRole().idBanco,
                uo.getStatus().idBanco
        );
    }

    public List<UsuarioOng> listarPorOng(Long idOng) {
        String sql = "SELECT * FROM TB_Usuario_ONG WHERE id_ong = ? AND id_status = 1";
        return jdbc.query(sql, mapper, idOng);
    }

    public List<UsuarioOng> listarPorUsuario(Long idUsuario) {
        String sql = "SELECT * FROM TB_Usuario_ONG WHERE id_usuario = ? AND id_status = 1";
        return jdbc.query(sql, mapper, idUsuario);
    }

    public void deletar(Long id) {
        // Soft delete — mantém histórico de vínculos
        String sql = "UPDATE TB_Usuario_ONG SET id_status = 3 WHERE id = ?";
        jdbc.update(sql, id);
    }
}
