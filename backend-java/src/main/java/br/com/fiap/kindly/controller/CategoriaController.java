package br.com.fiap.kindly.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.fiap.kindly.dao.CategoriaDao;
import br.com.fiap.kindly.model.Categoria;

@RestController
@RequestMapping("/categorias")
public class CategoriaController {

    private final CategoriaDao categoriaDao;

    public CategoriaController(CategoriaDao categoriaDao) {
        this.categoriaDao = categoriaDao;
    }

    @GetMapping
    public ResponseEntity<List<Categoria>> listar() {
        return ResponseEntity.ok(categoriaDao.listarTodas());
    }
}
