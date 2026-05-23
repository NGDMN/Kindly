package br.com.fiap.kindly.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.fiap.kindly.dao.OngDao;
import br.com.fiap.kindly.dao.UsuarioOngDao;
import br.com.fiap.kindly.dto.OngResponseDTO;
import br.com.fiap.kindly.model.ONG;
import br.com.fiap.kindly.model.UsuarioOng;
import br.com.fiap.kindly.security.UserDetailsImpl;

@RestController
@RequestMapping("/ongs")
public class OngController {

    private final OngDao ongDao;
    private final UsuarioOngDao usuarioOngDao;

    public OngController(OngDao ongDao, UsuarioOngDao usuarioOngDao) {
        this.ongDao = ongDao;
        this.usuarioOngDao = usuarioOngDao;
    }

    @GetMapping("/minhas")
    public ResponseEntity<List<OngResponseDTO>> listarMinhas(@AuthenticationPrincipal UserDetailsImpl principal) {
        List<UsuarioOng> vinculos = usuarioOngDao.listarPorUsuario(principal.getId());
        List<OngResponseDTO> resultado = new ArrayList<>();

        for (UsuarioOng v : vinculos) {
            Optional<ONG> ongOpt = ongDao.buscarPorId(v.getIdOng());
            if (ongOpt.isPresent()) {
                ONG ong = ongOpt.get();
                resultado.add(new OngResponseDTO(
                        ong.getId(),
                        ong.getRazaoSocial(),
                        ong.getNomeFantasia(),
                        ong.getCnpj(),
                        v.getRole() != null ? v.getRole().name() : null
                ));
            }
        }

        return ResponseEntity.ok(resultado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@AuthenticationPrincipal UserDetailsImpl principal,
            @PathVariable Long id,
            @RequestBody OngResponseDTO req) {
        // Valida vínculo: usuário só pode editar ONG que está vinculado
        boolean temVinculo = usuarioOngDao.listarPorUsuario(principal.getId()).stream()
                .anyMatch(v -> v.getIdOng().equals(id));

        if (!temVinculo) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Sem permissão para editar esta ONG.");
        }

        Optional<ONG> ongOpt = ongDao.buscarPorId(id);
        if (ongOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("ONG não encontrada.");
        }

        ONG ong = ongOpt.get();
        if (req.getRazaoSocial() != null) {
            ong.setRazaoSocial(req.getRazaoSocial());
        }
        if (req.getNomeFantasia() != null) {
            ong.setNomeFantasia(req.getNomeFantasia());
        }
        ongDao.atualizar(ong);

        return ResponseEntity.noContent().build();
    }
}
