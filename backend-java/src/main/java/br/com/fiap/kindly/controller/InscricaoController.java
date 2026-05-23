package br.com.fiap.kindly.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.fiap.kindly.dto.InscricaoRequest;
import br.com.fiap.kindly.model.Inscricao;
import br.com.fiap.kindly.security.UserDetailsImpl;
import br.com.fiap.kindly.service.InscricaoService;

@RestController
@RequestMapping("/inscricoes")
public class InscricaoController {

    private final InscricaoService inscricaoService;

    public InscricaoController(InscricaoService inscricaoService) {
        this.inscricaoService = inscricaoService;
    }

    @PostMapping
    public ResponseEntity<?> inscrever(@RequestBody InscricaoRequest req,
            @AuthenticationPrincipal UserDetailsImpl principal) {
        try {
            inscricaoService.inscrever(principal.getId(), req.getIdOportunidade());
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/minhas")
    public ResponseEntity<List<Inscricao>> listarMinhas(@AuthenticationPrincipal UserDetailsImpl principal) {
        return ResponseEntity.ok(inscricaoService.listarPorUsuario(principal.getId()));
    }

    @GetMapping("/oportunidade/{idOportunidade}")
    public ResponseEntity<List<Inscricao>> listarPorOportunidade(@PathVariable Long idOportunidade) {
        return ResponseEntity.ok(inscricaoService.listarPorOportunidade(idOportunidade));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelar(@PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl principal) {
        try {
            inscricaoService.cancelar(id, principal.getId());
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
