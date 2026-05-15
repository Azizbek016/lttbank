import { uz } from '../i18n/uz';

const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '/api';

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || uz.errors.default);
  }
  return data;
}

export async function createStatement(payload) {
  const res = await fetch(`${API_BASE}/statements`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function getStatement(id) {
  const res = await fetch(`${API_BASE}/statements/${id}`);
  return handleResponse(res);
}

export async function listStatements() {
  const res = await fetch(`${API_BASE}/statements`);
  return handleResponse(res);
}

export async function deleteStatement(id) {
  const res = await fetch(`${API_BASE}/statements/${id}`, { method: 'DELETE' });
  return handleResponse(res);
}
