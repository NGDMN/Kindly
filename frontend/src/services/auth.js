// Chaves separadas por portal
const CHAVE_ACCESS = "kindly_access_token";
const CHAVE_REFRESH = "kindly_refresh_token";

export function salvarTokens(accessToken, refreshToken) {
    localStorage.setItem(CHAVE_ACCESS, accessToken);
    localStorage.setItem(CHAVE_REFRESH, refreshToken);
}

export function getAccessToken() {
    return localStorage.getItem(CHAVE_ACCESS);
}

export function getRefreshToken() {
    return localStorage.getItem(CHAVE_REFRESH);
}

export function limparTokens() {
    localStorage.removeItem(CHAVE_ACCESS);
    localStorage.removeItem(CHAVE_REFRESH);
    limparOngAtiva();
}

export function estaAutenticado() {
    return !!getAccessToken();
}

const CHAVE_ONG_ATIVA = "kindly_ong_ativa";

export function salvarOngAtiva(ong) {
    localStorage.setItem(CHAVE_ONG_ATIVA, JSON.stringify(ong));
}

export function getOngAtiva() {
    try {
        const raw = localStorage.getItem(CHAVE_ONG_ATIVA);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function limparOngAtiva() {
    localStorage.removeItem(CHAVE_ONG_ATIVA);
}