package br.com.fiap.kindly.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import br.com.fiap.kindly.model.Inscricao;
import br.com.fiap.kindly.model.StatusInscricao;

@Repository
public class InscricaoDao {

    private final JdbcTemplate jdbc;

    @Autowired
    public InscricaoDao(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<Inscricao> mapper = (rs, rowNum) -> new Inscricao(
            rs.getLong("id"),
            rs.getBigDecimal("pontuacao_snap"),
            rs.getBigDecimal("modificador_snap"),
            rs.getLong("id_usuario"),
            rs.getLong("id_oportunidade"),
            StatusInscricao.fromId(rs.getInt("id_status_inscricao"))
    );

    public void inserir(Inscricao i) {
        String sql = """
                INSERT INTO TB_Inscricao (pontuacao_snap, modificador_snap, id_usuario, id_oportunidade, id_status_inscricao)
                VALUES (?, ?, ?, ?, ?)
                """;
        jdbc.update(sql,
                i.getPontuacaoSnap(),
                i.getModificadorSnap(),
                i.getIdUsuario(),
                i.getIdOportunidade(),
                i.getStatusInscricao().idBanco
        );
    }

    public List<Inscricao> listarPorUsuario(Long idUsuario) {
        String sql = "SELECT * FROM TB_Inscricao WHERE id_usuario = ?";
        return jdbc.query(sql, mapper, idUsuario);
    }

    public List<Inscricao> listarPorOportunidade(Long idOportunidade) {
        String sql = "SELECT * FROM TB_Inscricao WHERE id_oportunidade = ?";
        return jdbc.query(sql, mapper, idOportunidade);
    }

    public Optional<Inscricao> buscarPorId(Long id) {
        String sql = "SELECT * FROM TB_Inscricao WHERE id = ?";
        return jdbc.query(sql, mapper, id).stream().findFirst();
    }

    public void atualizarStatus(Long id, StatusInscricao novoStatus) {
        // Snapshots são imutáveis — só o status muda no ciclo de vida da inscrição
        String sql = "UPDATE TB_Inscricao SET id_status_inscricao = ? WHERE id = ?";
        jdbc.update(sql, novoStatus.idBanco, id);
    }

    public void cancelar(Long id) {
        String sql = "UPDATE TB_Inscricao SET id_status_inscricao = 4 WHERE id = ?";
        jdbc.update(sql, id);
    }
}
