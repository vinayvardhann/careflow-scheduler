const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getToken(): string | null {
  const user = localStorage.getItem('medschedule_user');
  if (user) {
    return JSON.parse(user).token;
  }
  return null;
}

async function request(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }

  return res.json();
}

// Auth
export const authApi = {
  login: (email: string, password: string) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (data: { name: string; email: string; password: string; role?: string; age?: number; phone?: string }) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  getProfile: () => request('/auth/profile'),
};

// Doctors
export const doctorsApi = {
  getAll: () => request('/doctors'),
};

// Appointments
export const appointmentsApi = {
  getAll: (filters?: Record<string, string>) => {
    const params = new URLSearchParams(filters || {}).toString();
    return request(`/appointments${params ? `?${params}` : ''}`);
  },
  getStats: () => request('/appointments/stats'),
  create: (data: {
    doctorId: string; date: string; startTime: string; endTime: string;
    priority?: string; reason?: string; patientName?: string; patientAge?: number;
  }) => request('/appointments', { method: 'POST', body: JSON.stringify(data) }),
  updateStatus: (id: string, status: string) =>
    request(`/appointments/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  reschedule: (id: string, data: { date: string; startTime: string; endTime: string }) =>
    request(`/appointments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  cancel: (id: string) => request(`/appointments/${id}`, { method: 'DELETE' }),
};
