package br.com.fiap.kindly.dao;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.Optional;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import br.com.fiap.kindly.model.RefreshToken;

@Repository
public class RefreshTokenDao {

    private final JdbcTemplate jdbc;

    public RefreshTokenDao(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<RefreshToken> mapper = (rs, rowNum) -> new RefreshToken(
            rs.getLong("id"),
            rs.getString("token"),
            rs.getLong("id_usuario"),
            rs.getTimestamp("expiracao").toInstant()
    );

    public void inserir(RefreshToken rt) {
        String sql = "INSERT INTO TB_RefreshToken (token, id_usuario, expiracao) VALUES (?, ?, ?)";
        jdbc.update(sql, rt.getToken(), rt.getIdUsuario(), Timestamp.from(rt.getExpiracao()));
    }

    public Optional<RefreshToken> buscarPorToken(String token) {
        String sql = "SELECT * FROM TB_RefreshToken WHERE token = ?";
        return jdbc.query(sql, mapper, token).stream().findFirst();
    }

    public void deletarPorToken(String token) {
        jdbc.update("DELETE FROM TB_RefreshToken WHERE token = ?", token);
    }

    public void deletarPorUsuario(Long idUsuario) {
        jdbc.update("DELETE FROM TB_RefreshToken WHERE id_usuario = ?", idUsuario);
    }
}
