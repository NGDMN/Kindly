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

export function getUsuarioDoToken() {
    const token = getAccessToken();
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.sub; // sub = username definido no JwtUtil.gerarToken()
    } catch {
        return null;
    }
}

// --- Endpoints de oportunidades ---

export async function listarOportunidades() {
    const { data } = await api.get("/oportunidades");
    return data;
}

export async function criarOportunidade(payload) {
    const { data } = await api.post("/oportunidades", payload);
    return data;
}

export async function atualizarOportunidade(id, payload) {
    const { data } = await api.put(`/oportunidades/${id}`, payload);
    return data;
}

// --- Endpoints de inscrições ---

export async function inscreverEmOportunidade(idOportunidade) {
    const { data } = await api.post("/inscricoes", { idOportunidade });
    return data;
}

export async function listarMinhasInscricoes() {
    const { data } = await api.get("/inscricoes/minhas");
    return data;
}

export async function listarInscricoesDaOportunidade(idOportunidade) {
    const { data } = await api.get(`/inscricoes/oportunidade/${idOportunidade}`);
    return data;
}

export async function cancelarInscricao(idInscricao) {
    const { data } = await api.delete(`/inscricoes/${idInscricao}`);
    return data;
}

// --- Endpoints de usuário logado ---

export async function obterMeusDados() {
    const { data } = await api.get("/me");
    return data;
}

export async function obterRanking() {
    const { data } = await api.get("/usuarios/ranking");
    return data;
}

// --- Endpoints de categorias ---

export async function listarCategorias() {
    const { data } = await api.get("/categorias");
    return data;
}

// --- Endpoints de ONG ---

export async function listarMinhasOngs() {
    const { data } = await api.get("/ongs/minhas");
    return data;
}

export async function atualizarOng(id, payload) {
    const { data } = await api.put(`/ongs/${id}`, payload);
    return data;
}

// --- Alteração de senha ---

export async function alterarSenha(senhaAtual, senhaNova) {
    const { data } = await api.put("/auth/senha", { senhaAtual, senhaNova });
    return data;
}

export default api;