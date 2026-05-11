// ═══════════════════════════════════════════════════════════════════════════════
// API SERVICE — Integração com Backend Java
// ═══════════════════════════════════════════════════════════════════════════════
// Arquivo: frontend/src/services/api.js
// 
// Este arquivo contém todas as funções que fazem requisições HTTP para o backend.
// URL base: http://localhost:8080
// Todos os endpoints usam método POST

import axios from 'axios';

// ───────────────────────────────────────────────────────────────────────────────
// CONFIGURAÇÃO
// ───────────────────────────────────────────────────────────────────────────────

const API_URL = 'http://localhost:8080';

// Criar instância do axios com configurações padrão
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado, tentar renovar
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ───────────────────────────────────────────────────────────────────────────────
// AUTENTICAÇÃO
// ───────────────────────────────────────────────────────────────────────────────

/**
 * Registrar novo usuário (ONG ou Voluntário)
 * @param {Object} data - Dados do usuário
 * @param {string} data.nome - Nome
 * @param {string} data.cpf - CPF
 * @param {string} data.usuario - Usuário (username)
 * @param {string} data.senha - Senha
 * @param {string} data.motor - Motor de banco de dados (C, K ou A)
 * @returns {Promise<Object>} { accessToken, refreshToken, tokenType }
 */
export const register = async (data) => {
  try {
    const response = await api.post('/auth/register', {
      nome: data.nome,
      cpf: data.cpf,
      usuario: data.usuario,
      senha: data.senha,
      motor: data.motor || 'C', // Padrão: C
    });

    // Salvar tokens no localStorage
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    localStorage.setItem('tokenType', response.data.tokenType);

    return response.data;
  } catch (error) {
    // Backend retorna erro como String puro
    const errorMessage = error.response?.data || 'Erro ao registrar ONG';
    throw new Error(errorMessage);
  }
};

/**
 * Login de usuário (ONG ou Voluntário)
 * @param {string} usuario - Usuário (username)
 * @param {string} senha - Senha
 * @returns {Promise<Object>} { accessToken, refreshToken, tokenType }
 */
export const login = async (usuario, senha) => {
  try {
    const response = await api.post('/auth/login', {
      usuario,
      senha,
    });

    // Salvar tokens no localStorage
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    localStorage.setItem('tokenType', response.data.tokenType);

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data || 'Erro ao fazer login';
    throw new Error(errorMessage);
  }
};

/**
 * Renovar token de acesso
 * @returns {Promise<Object>} { accessToken, refreshToken, tokenType }
 */
export const refreshToken = async () => {
  try {
    const refreshTokenValue = localStorage.getItem('refreshToken');

    if (!refreshTokenValue) {
      throw new Error('Refresh token não encontrado');
    }

    const response = await api.post('/auth/refresh', {
      refreshToken: refreshTokenValue,
    });

    // Atualizar tokens no localStorage
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    localStorage.setItem('tokenType', response.data.tokenType);

    return response.data;
  } catch (error) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenType');
    throw new Error('Erro ao renovar token');
  }
};

/**
 * Logout do usuário (ONG ou Voluntário)
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    const refreshTokenValue = localStorage.getItem('refreshToken');

    if (refreshTokenValue) {
      await api.post('/auth/logout', {
        refreshToken: refreshTokenValue,
      });
    }

    // Limpar tokens do localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenType');
  } catch (error) {
    // Mesmo se falhar, limpar tokens localmente
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenType');
    console.error('Erro ao fazer logout:', error);
  }
};
