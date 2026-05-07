package br.com.fiap.kindly.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.fiap.kindly.dao.OngDao;
import br.com.fiap.kindly.model.ONG;
import br.com.fiap.kindly.model.Status;

@Service
public class OngService {

    private final OngDao ongDao;

    @Autowired
    public OngService(OngDao ongDao) {
        this.ongDao = ongDao;
    }

    public void cadastrar(String cnpj, String razaoSocial, String nomeFantasia) {
        validarCadastro(cnpj, razaoSocial, nomeFantasia);

        ONG novaOng = new ONG(
                null,
                cnpj,
                razaoSocial,
                nomeFantasia,
                Status.Ativo
        );
        ongDao.inserir(novaOng);
    }

    public List<ONG> listarAtivas() {
        return ongDao.listarAtivas();
    }

    public ONG buscarPorId(Long id) {
        return ongDao.buscarPorId(id)
                .orElseThrow(() -> new IllegalArgumentException("ONG não encontrada."));
    }

    public void atualizar(Long id, String cnpj, String razaoSocial, String nomeFantasia) {
        ONG existente = buscarPorId(id);
        validarCadastro(cnpj, razaoSocial, nomeFantasia);

        existente.setCnpj(cnpj);
        existente.setRazaoSocial(razaoSocial);
        existente.setNomeFantasia(nomeFantasia);
        ongDao.atualizar(existente);
    }

    public void deletar(Long id) {
        buscarPorId(id); // garante que existe antes de deletar
        ongDao.deletar(id);
    }

    private void validarCadastro(String cnpj, String razaoSocial, String nomeFantasia) {
        if (cnpj == null || cnpj.length() != 14) {
            throw new IllegalArgumentException("CNPJ inválido.");
        }
        if (razaoSocial == null || razaoSocial.isBlank()) {
            throw new IllegalArgumentException("Razão social é obrigatória.");
        }
        if (nomeFantasia == null || nomeFantasia.isBlank()) {
            throw new IllegalArgumentException("Nome fantasia é obrigatório.");
        }
    }
}
