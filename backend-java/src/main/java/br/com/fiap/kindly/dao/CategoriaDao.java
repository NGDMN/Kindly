package br.com.fiap.kindly.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import br.com.fiap.kindly.model.Categoria;

@Repository
public class CategoriaDao {

    private final JdbcTemplate jdbc;

    @Autowired
    public CategoriaDao(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<Categoria> mapper = (rs, rowNum) -> new Categoria(
            rs.getLong("id"),
            rs.getString("nome")
    );

    public List<Categoria> listarTodas() {
        String sql = "SELECT * FROM TB_Categoria ORDER BY id";
        return jdbc.query(sql, mapper);
    }

    public Optional<Categoria> buscarPorId(Long id) {
        String sql = "SELECT * FROM TB_Categoria WHERE id = ?";
        return jdbc.query(sql, mapper, id).stream().findFirst();
    }
}
