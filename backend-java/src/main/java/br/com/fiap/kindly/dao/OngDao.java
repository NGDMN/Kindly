package br.com.fiap.kindly.dao;

import java.util.List;
import java.util.Optional;

import br.com.fiap.kindly.model.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import br.com.fiap.kindly.model.ONG;
import br.com.fiap.kindly.model.Status;

@Repository
public class OngDao {

    private final JdbcTemplate jdbc;

    @Autowired
    public OngDao(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<ONG> mapper = (rs, rowNum) -> new ONG(
            rs.getLong("id"),
            rs.getString("cnpj"),
            rs.getString("razao_social"),
            rs.getString("nome_fantasia"),
            Status.fromId(rs.getInt("id_status"))
    );

    public void inserir(ONG o) {
        String sql = """
                INSERT INTO TB_ONG (cnpj, razao_social, nome_fantasia, id_status)
                VALUES (?, ?, ?, ?)
                """;
        jdbc.update(sql,
                o.getCnpj(),
                o.getRazaoSocial(),
                o.getNomeFantasia(),
                o.getStatus().idBanco
        );
    }

    public List<ONG> listarAtivas() {
        String sql = "SELECT * FROM TB_ONG WHERE id_status = 1";
        return jdbc.query(sql, mapper);
    }

    public Optional<ONG> buscarPorId(Long id) {
        String sql = "SELECT * FROM TB_ONG WHERE id = ?";
        return jdbc.query(sql, mapper, id).stream().findFirst();
    }

    public Optional<ONG> buscarPorRazaoSocial(String razaoSocial) {
        String sql = "SELECT * FROM TB_ONG WHERE razao_social = ?";
        return jdbc.query(sql, mapper, razaoSocial).stream().findFirst();
    }

    public Optional<ONG> buscarPorCnpj(String cnpj) {
        String sql = "SELECT * FROM TB_ONG WHERE cnpj = ?";
        return jdbc.query(sql, mapper, cnpj).stream().findFirst();
    }

    public void atualizar(ONG o) {
        String sql = """
                UPDATE TB_ONG
                SET cnpj = ?, razao_social = ?, nome_fantasia = ?, id_status = ?
                WHERE id = ?
                """;
        jdbc.update(sql,
                o.getCnpj(),
                o.getRazaoSocial(),
                o.getNomeFantasia(),
                o.getStatus().idBanco,
                o.getId()
        );
    }

    public void deletar(Long id) {
        String sql = "UPDATE TB_ONG SET id_status = 3 WHERE id = ?";
        jdbc.update(sql, id);
    }
}
