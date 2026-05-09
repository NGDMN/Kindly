package br.com.fiap.kindly.service;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.fiap.kindly.dao.StreakDao;
import br.com.fiap.kindly.model.Streak;

@Service
public class StreakService {

    private final StreakDao streakDao;

    @Autowired
    public StreakService(StreakDao streakDao) {
        this.streakDao = streakDao;
    }

    public void registrarSemana(Long idUsuario, boolean mantida) {
        Streak ultima = streakDao.buscarUltimaPorUsuario(idUsuario).orElse(null);

        int totalAtual = 0;
        if (ultima != null && ultima.getStreakMantida()) {
            totalAtual = ultima.getTotalStreak();
        }

        int novoTotal = mantida ? totalAtual + 1 : 0;

        Streak nova = new Streak(
                null,
                Date.valueOf(LocalDate.now()),
                mantida,
                novoTotal,
                idUsuario
        );
        streakDao.inserir(nova);
    }

    public int buscarTotalAtual(Long idUsuario) {
        return streakDao.buscarUltimaPorUsuario(idUsuario)
                .map(s -> s.getStreakMantida() ? s.getTotalStreak() : 0)
                .orElse(0);
    }

    public List<Streak> listarHistorico(Long idUsuario) {
        return streakDao.listarPorUsuario(idUsuario);
    }
}
