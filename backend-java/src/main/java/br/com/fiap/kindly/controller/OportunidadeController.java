package br.com.fiap.kindly.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.fiap.kindly.dto.OportunidadeRequest;
import br.com.fiap.kindly.dto.OportunidadeResponseDTO;
import br.com.fiap.kindly.security.UserDetailsImpl;
import br.com.fiap.kindly.service.OportunidadeService;

@RestController
@RequestMapping("/oportunidades")
public class OportunidadeController {

    private final OportunidadeService oportunidadeService;

    public OportunidadeController(OportunidadeService oportunidadeService) {
        this.oportunidadeService = oportunidadeService;
    }

    @GetMapping
    public ResponseEntity<List<OportunidadeResponseDTO>> listar() {
        return ResponseEntity.ok(oportunidadeService.listarAtivasComPontuacao());
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody OportunidadeRequest req,
            @AuthenticationPrincipal UserDetailsImpl principal) {
        try {
            oportunidadeService.cadastrar(principal.getId(), req);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id,
            @RequestBody OportunidadeRequest req,
            @AuthenticationPrincipal UserDetailsImpl principal) {
        try {
            oportunidadeService.atualizar(principal.getId(), id, req);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
