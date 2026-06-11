const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Helper to fetch from backend with authorization header
 */
async function apiCall(endpoint, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers
  };

  // If body is FormData (e.g. file upload), let the browser set the Content-Type with boundaries
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong with the request.');
  }

  return data;
}

export const api = {
  // Auth
  register: (name, email, password) => 
    apiCall('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
  
  login: (email, password) => 
    apiCall('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  
  getProfile: () => 
    apiCall('/auth/profile'),
  
  updateProfile: (profileData) => 
    apiCall('/auth/profile', { method: 'PUT', body: JSON.stringify(profileData) }),

  // Schemes
  getSchemes: (category) => 
    apiCall(`/schemes${category ? `?category=${category}` : ''}`),
  
  getSchemeById: (id) => 
    apiCall(`/schemes/${id}`),

  // Wallet
  getWallet: () => 
    apiCall('/wallet'),
  
  uploadDocument: (formData) => 
    apiCall('/wallet/upload', { method: 'POST', body: formData }),
  
  deleteDocument: (id) => 
    apiCall(`/wallet/${id}`, { method: 'DELETE' }),

  // Agents
  runAgentChat: (message, chatHistory) => 
    apiCall('/agents/chat', { method: 'POST', body: JSON.stringify({ message, chatHistory }) }),
  
  getAgentLogs: () => 
    apiCall('/agents/logs'),

  // Dashboard
  getDashboard: () => 
    apiCall('/dashboard'),
  
  markNotificationRead: (id) => 
    apiCall(`/dashboard/notifications/${id}/read`, { method: 'PUT' })
};
