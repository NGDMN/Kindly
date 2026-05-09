package br.com.fiap.kindly.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

import br.com.fiap.kindly.model.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import br.com.fiap.kindly.dao.RefreshTokenDao;
import br.com.fiap.kindly.dao.UsuarioDao;
import br.com.fiap.kindly.dto.AuthResponse;
import br.com.fiap.kindly.dto.LoginRequest;
import br.com.fiap.kindly.dto.RegisterRequest;
import br.com.fiap.kindly.security.JwtUtil;
import br.com.fiap.kindly.security.UserDetailsImpl;

@Service
public class AuthService {

    private final UsuarioDao usuarioDao;
    private final RefreshTokenDao refreshTokenDao;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UsuarioService usuarioService;

    @Value("${jwt.refresh-expiration-days}")
    private long refreshExpirationDays;

    public AuthService(UsuarioDao usuarioDao,
            RefreshTokenDao refreshTokenDao,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtUtil jwtUtil,
            UsuarioService usuarioService) {
        this.usuarioDao = usuarioDao;
        this.refreshTokenDao = refreshTokenDao;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.usuarioService = usuarioService;
    }

    public AuthResponse registrar(RegisterRequest req) {
        String senhaCodificada = passwordEncoder.encode(req.getSenha());
        usuarioService.cadastrar(
                req.getNome(),
                req.getCpf(),
                req.getUsuario(),
                senhaCodificada,
                req.getMotor() != null ? Motor.fromCodigo(req.getMotor()) : null
        );

        Usuario salvo = usuarioDao.buscarPorUsuario(req.getUsuario())
                .orElseThrow(() -> new IllegalStateException("Erro ao recuperar usuário após registro"));

        String accessToken = jwtUtil.gerarToken(salvo.getUsuario());
        String refreshToken = criarRefreshToken(salvo.getId());
        return new AuthResponse(accessToken, refreshToken);
    }

    public AuthResponse login(LoginRequest req) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getUsuario(), req.getSenha())
        );

        UserDetailsImpl principal = (UserDetailsImpl) auth.getPrincipal();
        String accessToken = jwtUtil.gerarToken(principal.getUsername());

        refreshTokenDao.deletarPorUsuario(principal.getId());
        String refreshToken = criarRefreshToken(principal.getId());

        return new AuthResponse(accessToken, refreshToken);
    }

    public AuthResponse refresh(String tokenValue) {
        RefreshToken rt = refreshTokenDao.buscarPorToken(tokenValue)
                .orElseThrow(() -> new IllegalArgumentException("Refresh token inválido"));

        if (rt.getExpiracao().isBefore(Instant.now())) {
            refreshTokenDao.deletarPorToken(tokenValue);
            throw new IllegalArgumentException("Refresh token expirado");
        }

        Usuario usuario = usuarioDao.buscarPorId(rt.getIdUsuario())
                .orElseThrow(() -> new IllegalStateException("Usuário não encontrado"));

        refreshTokenDao.deletarPorToken(tokenValue);
        String novoRefreshToken = criarRefreshToken(usuario.getId());
        String novoAccessToken = jwtUtil.gerarToken(usuario.getUsuario());

        return new AuthResponse(novoAccessToken, novoRefreshToken);
    }

    public void logout(String tokenValue) {
        refreshTokenDao.deletarPorToken(tokenValue);
    }

    private String criarRefreshToken(Long idUsuario) {
        RefreshToken rt = new RefreshToken();
        rt.setToken(UUID.randomUUID().toString());
        rt.setIdUsuario(idUsuario);
        rt.setExpiracao(Instant.now().plus(refreshExpirationDays, ChronoUnit.DAYS));
        refreshTokenDao.inserir(rt);
        return rt.getToken();
    }
}
