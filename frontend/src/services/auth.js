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
}

export function estaAutenticado() {
    return !!getAccessToken();
}