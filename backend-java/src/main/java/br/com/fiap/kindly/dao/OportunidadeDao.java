package br.com.fiap.kindly.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import br.com.fiap.kindly.model.Oportunidade;
import br.com.fiap.kindly.model.Status;

@Repository
public class OportunidadeDao {

    private final JdbcTemplate jdbc;

    @Autowired
    public OportunidadeDao(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<Oportunidade> mapper = (rs, rowNum) -> new Oportunidade(
            rs.getLong("id"),
            rs.getString("titulo"),
            rs.getString("descricao"),
            rs.getDate("data_evento"),
            rs.getString("endereco"),
            rs.getBigDecimal("local_lat"),
            rs.getBigDecimal("local_long"),
            rs.getInt("vagas_total"),
            rs.getInt("vagas_presente"),
            rs.getInt("vagas_noshow"),
            rs.getLong("id_ong"),
            rs.getLong("id_categoria"),
            Status.fromId(rs.getInt("id_status"))
    );

    public void inserir(Oportunidade o) {
        String sql = """
                INSERT INTO TB_Oportunidade
                    (titulo, descricao, data_evento, endereco, local_lat, local_long, vagas_total, vagas_presente, vagas_noshow, id_ong, id_categoria, id_status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """;
        jdbc.update(sql,
                o.getTitulo(),
                o.getDescricao(),
                o.getDataEvento(),
                o.getEndereco(),
                o.getLocalLat(),
                o.getLocalLong(),
                o.getVagasTotal(),
                o.getVagasPresente(),
                o.getVagasNoShow(),
                o.getIdOng(),
                o.getIdCategoria(),
                o.getStatus().idBanco
        );
    }

    public List<Oportunidade> listarAtivas() {
        String sql = "SELECT * FROM TB_Oportunidade WHERE id_status = 1 ORDER BY data_evento";
        return jdbc.query(sql, mapper);
    }

    public List<Oportunidade> listarPorOng(Long idOng) {
        String sql = "SELECT * FROM TB_Oportunidade WHERE id_ong = ? AND id_status = 1 ORDER BY data_evento";
        return jdbc.query(sql, mapper, idOng);
    }

    public List<Oportunidade> listarPorCategoria(Long idCategoria) {
        String sql = "SELECT * FROM TB_Oportunidade WHERE id_categoria = ? AND id_status = 1 ORDER BY data_evento";
        return jdbc.query(sql, mapper, idCategoria);
    }

    public Optional<Oportunidade> buscarPorId(Long id) {
        String sql = "SELECT * FROM TB_Oportunidade WHERE id = ?";
        return jdbc.query(sql, mapper, id).stream().findFirst();
    }

    public void atualizar(Oportunidade o) {
        String sql = """
                UPDATE TB_Oportunidade
                SET titulo = ?, descricao = ?, data_evento = ?, endereco = ?, local_lat = ?, local_long = ?,
                    vagas_total = ?, vagas_presente = ?, vagas_noshow = ?, id_ong = ?, id_categoria = ?, id_status = ?
                WHERE id = ?
                """;
        jdbc.update(sql,
                o.getTitulo(),
                o.getDescricao(),
                o.getDataEvento(),
                o.getEndereco(),
                o.getLocalLat(),
                o.getLocalLong(),
                o.getVagasTotal(),
                o.getVagasPresente(),
                o.getVagasNoShow(),
                o.getIdOng(),
                o.getIdCategoria(),
                o.getStatus().idBanco,
                o.getId()
        );
    }

    public void deletar(Long id) {
        // Soft delete
        String sql = "UPDATE TB_Oportunidade SET id_status = 3 WHERE id = ?";
        jdbc.update(sql, id);
    }
}
