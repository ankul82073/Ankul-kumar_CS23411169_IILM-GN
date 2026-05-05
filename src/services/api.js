import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:8000');

const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
});

export const detectImage = async (file) => {
  const form = new FormData();
  form.append('file', file);
  const { data } = await api.post('/api/detect', form);
  return data;
};

export const simulateAttack = async (file, attackType, epsilon) => {
  const form = new FormData();
  form.append('file', file);
  form.append('attack_type', attackType);
  form.append('epsilon', epsilon);
  const { data } = await api.post('/api/simulate', form);
  return data;
};

export const fetchDashboard = async () => {
  const { data } = await api.get('/api/analytics/dashboard');
  return data;
};

export const fetchHistory = async (limit = 20) => {
  const { data } = await api.get(`/api/analytics/history?limit=${limit}`);
  return data;
};

export const checkHealth = async () => {
  const { data } = await api.get('/api/health');
  return data;
};

export default api;
