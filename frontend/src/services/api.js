import axios from "axios";
import { getAccessToken, getRefreshToken, salvarTokens, limparTokens } from "./auth";

const BASE_URL = "http://localhost:8080";

const api = axios.create({
    baseURL: BASE_URL,
});

// Injeta o accessToken em toda requisição que sair por este cliente
api.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// --- Endpoints de autenticação ---

export async function registrar({ nome, cpf, usuario, senha, motor }) {
    const { data } = await api.post("/auth/register", {
        nome,
        cpf,
        usuario,
        senha,
        motor,
    });
    salvarTokens(data.accessToken, data.refreshToken);
    return data;
}

export async function login({ usuario, senha }) {
    const { data } = await api.post("/auth/login", { usuario, senha });
    salvarTokens(data.accessToken, data.refreshToken);
    return data;
}

export async function logout() {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
        await api.post("/auth/logout", { refreshToken }).catch(() => { });
    }
    limparTokens();
}

export async function refresh() {
    const refreshToken = getRefreshToken();
    if (!refreshToken) throw new Error("Sem refresh token.");
    const { data } = await api.post("/auth/refresh", { refreshToken });
    salvarTokens(data.accessToken, data.refreshToken);
    return data;
}

export default api;