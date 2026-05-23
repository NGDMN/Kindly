package br.com.fiap.kindly.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.fiap.kindly.dto.MeResponseDTO;
import br.com.fiap.kindly.dto.RankingItemDTO;
import br.com.fiap.kindly.security.UserDetailsImpl;
import br.com.fiap.kindly.service.UsuarioService;

@RestController
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping("/me")
    public ResponseEntity<MeResponseDTO> obterMeusDados(@AuthenticationPrincipal UserDetailsImpl principal) {
        MeResponseDTO dto = usuarioService.obterMeusDados(principal.getId());
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/usuarios/ranking")
    public ResponseEntity<List<RankingItemDTO>> obterRanking() {
        return ResponseEntity.ok(usuarioService.obterRanking());
    }
}
