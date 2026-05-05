package br.com.fiap.kindly.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import br.com.fiap.kindly.model.Streak;

@Repository
public class StreakDao {

    private final JdbcTemplate jdbc;

    @Autowired
    public StreakDao(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<Streak> mapper = (rs, rowNum) -> new Streak(
            rs.getLong("id"),
            rs.getDate("semana_referencia"),
            "T".equals(rs.getString("streak_mantida")),
            rs.getInt("total_streak"),
            rs.getLong("id_usuario")
    );

    public void inserir(Streak s) {
        String sql = """
                INSERT INTO TB_Streak (semana_referencia, streak_mantida, total_streak, id_usuario)
                VALUES (?, ?, ?, ?)
                """;
        jdbc.update(sql,
                s.getSemanaReferencia(),
                s.getStreakMantida() ? "T" : "F",
                s.getTotalStreak(),
                s.getIdUsuario()
        );
    }

    public List<Streak> listarPorUsuario(Long idUsuario) {
        String sql = "SELECT * FROM TB_Streak WHERE id_usuario = ? ORDER BY semana_referencia DESC";
        return jdbc.query(sql, mapper, idUsuario);
    }

    public Optional<Streak> buscarUltimaPorUsuario(Long idUsuario) {
        // FETCH FIRST 1 ROWS ONLY é a sintaxe Oracle para LIMIT 1
        // Não usar ROWNUM aqui — é aplicado antes do ORDER BY e retorna resultado errado
        String sql = "SELECT * FROM TB_Streak WHERE id_usuario = ? ORDER BY semana_referencia DESC FETCH FIRST 1 ROWS ONLY";
        return jdbc.query(sql, mapper, idUsuario).stream().findFirst();
    }
}
