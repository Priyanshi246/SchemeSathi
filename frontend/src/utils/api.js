import { getMockDashboard, sampleSchemes, sampleDocuments, mockNotifications, initialMockUser } from './mockData';

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Helper to fetch from backend with authorization header, falling back to mock if network fails
 */
async function apiCall(endpoint, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers
  };

  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong with the request.');
    }

    return data;
  } catch (error) {
    console.warn(`API call failed for ${endpoint}. Falling back to simulated local database. Details:`, error.message);
    
    // Check if network failed or server offline
    if (error instanceof TypeError || error.message.includes('fetch') || error.message.includes('Failed to fetch') || error.message.includes('network')) {
      return runSimulatedApi(endpoint, options);
    }
    throw error;
  }
}

// Simulated backend actions
function runSimulatedApi(endpoint, options) {
  if (typeof window === 'undefined') return { data: {} };

  // Parse body if present
  let body = {};
  if (options.body && typeof options.body === 'string') {
    try {
      body = JSON.parse(options.body);
    } catch (_) {}
  }

  // Auth Routing
  if (endpoint === '/auth/register') {
    const { name, email, password } = body;
    const user = { ...initialMockUser, name, email };
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', 'mock-jwt-token-sathiai');
    return { token: 'mock-jwt-token-sathiai', user };
  }

  if (endpoint === '/auth/login') {
    const { email, password } = body;
    // Simple check
    if (email.includes('admin')) {
      const user = { name: "Priya Sharma (Officer)", email, role: "Admin", state: "Rajasthan" };
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', 'mock-jwt-token-admin');
      return { token: 'mock-jwt-token-admin', user };
    }
    
    // Normal / Demo citizen login
    const user = getLocalStorage('user') || { ...initialMockUser, email };
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', 'mock-jwt-token-sathiai');
    return { token: 'mock-jwt-token-sathiai', user };
  }

  if (endpoint === '/auth/profile') {
    if (options.method === 'PUT') {
      const existingUser = getLocalStorage('user') || initialMockUser;
      const updatedUser = { ...existingUser, ...body };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return { data: updatedUser };
    }
    return { data: getLocalStorage('user') || initialMockUser };
  }

  // Dashboard Summary
  if (endpoint === '/dashboard') {
    return { data: getMockDashboard() };
  }

  // Notifications
  if (endpoint.startsWith('/dashboard/notifications/')) {
    // Mark as read
    const notifId = endpoint.split('/')[3];
    const logs = getLocalStorage('agentLogs') || [];
    // Just mock success
    return { success: true };
  }

  // Schemes
  if (endpoint.startsWith('/schemes')) {
    const user = getLocalStorage('user') || initialMockUser;
    // Filter schemes based on category or profile details dynamically
    const stateMatch = user.state || 'Rajasthan';
    const isRajasthan = stateMatch.toLowerCase() === 'rajasthan';

    const adjustedSchemes = sampleSchemes.map(s => {
      // If user state is not Rajasthan, decrease match percentage of Rajasthan scheme
      if (s.id === 'scheme-1' && !isRajasthan) {
        return {
          ...s,
          match_percentage: 15,
          documentStatus: { ...s.documentStatus, missing: ['Domicile Certificate (Must be Rajasthan)'], readinessScore: 40 },
          eligibility: { ...s.eligibility, summary: "Ineligible: Domicile state does not match Rajasthan." }
        };
      }
      return s;
    });

    return { data: adjustedSchemes };
  }

  // Document Wallet
  if (endpoint === '/wallet') {
    return { data: getLocalStorage('documents') || sampleDocuments };
  }

  if (endpoint === '/wallet/upload') {
    // FormData upload simulation
    const docs = getLocalStorage('documents') || sampleDocuments;
    const newDoc = {
      id: `doc-${Date.now()}`,
      name: "Uploaded Document",
      type: "User Upload",
      status: "Verified",
      date: new Date().toISOString().split('T')[0]
    };
    const updatedDocs = [...docs, newDoc];
    localStorage.setItem('documents', JSON.stringify(updatedDocs));
    return { data: newDoc };
  }

  if (endpoint.startsWith('/wallet/')) {
    if (options.method === 'DELETE') {
      const docId = endpoint.split('/')[2];
      const docs = getLocalStorage('documents') || sampleDocuments;
      const updatedDocs = docs.filter(d => d.id !== docId);
      localStorage.setItem('documents', JSON.stringify(updatedDocs));
      return { success: true };
    }
  }

  // Chat/Agent simulation
  if (endpoint === '/agents/chat') {
    const { message } = body;
    const user = getLocalStorage('user') || initialMockUser;
    
    // Simulate updating profile variables dynamically from message text
    const text = message.toLowerCase();
    let updated = false;
    let feedbackText = "";

    if (text.includes('rajasthan')) {
      user.state = 'Rajasthan';
      updated = true;
    } else if (text.includes('bihar')) {
      user.state = 'Bihar';
      updated = true;
    }

    if (text.includes('lakh') || text.includes('income')) {
      const incomeMatch = text.match(/(\d+)\s*(lakh|lacs)/);
      if (incomeMatch) {
        user.income = parseInt(incomeMatch[1]) * 100000;
        updated = true;
      }
    }

    if (text.includes('student')) {
      user.occupation = 'Student';
      user.education = 'Undergraduate';
      updated = true;
    } else if (text.includes('farmer') || text.includes('agriculture')) {
      user.occupation = 'Farmer';
      updated = true;
    } else if (text.includes('entrepreneur') || text.includes('business')) {
      user.occupation = 'Entrepreneur';
      updated = true;
    }

    if (updated) {
      localStorage.setItem('user', JSON.stringify(user));
      // Recompute agent activities
      const newLogs = [
        {
          agent_name: "Citizen Profiling Agent",
          log_text: `Extracted parameters: state: ${user.state}, income: ₹${user.income}, occupation: ${user.occupation}.`,
          timestamp: new Date().toISOString()
        },
        {
          agent_name: "Eligibility Agent",
          log_text: "Checking state-level scheme rules dynamically against parameters.",
          timestamp: new Date().toISOString()
        },
        {
          agent_name: "Document Readiness Agent",
          log_text: "Audited secure digital wallet. Mapped document checklists.",
          timestamp: new Date().toISOString()
        }
      ];
      localStorage.setItem('agentLogs', JSON.stringify(newLogs));
    }

    const stateMatch = user.state || 'Rajasthan';
    const isRajasthan = stateMatch.toLowerCase() === 'rajasthan';
    const activeSchemes = sampleSchemes.filter(s => {
      if (s.id === 'scheme-1') return isRajasthan;
      return true;
    });

    return {
      data: {
        profile: user,
        matchedSchemes: activeSchemes
      }
    };
  }

  return { data: {} };
}

function getLocalStorage(key) {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(key);
  try {
    return data ? JSON.parse(data) : null;
  } catch (_) {
    return data;
  }
}

export const api = {
  register: (name, email, password) => 
    apiCall('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
  
  login: (email, password) => 
    apiCall('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  
  getProfile: () => 
    apiCall('/auth/profile'),
  
  updateProfile: (profileData) => 
    apiCall('/auth/profile', { method: 'PUT', body: JSON.stringify(profileData) }),

  getSchemes: (category) => 
    apiCall(`/schemes${category ? `?category=${category}` : ''}`),
  
  getSchemeById: (id) => 
    apiCall(`/schemes/${id}`),

  getWallet: () => 
    apiCall('/wallet'),
  
  uploadDocument: (formData) => 
    apiCall('/wallet/upload', { method: 'POST', body: formData }),
  
  deleteDocument: (id) => 
    apiCall(`/wallet/${id}`, { method: 'DELETE' }),

  runAgentChat: (message, chatHistory) => 
    apiCall('/agents/chat', { method: 'POST', body: JSON.stringify({ message, chatHistory }) }),
  
  getAgentLogs: () => 
    apiCall('/agents/logs'),

  getDashboard: () => 
    apiCall('/dashboard'),
  
  markNotificationRead: (id) => 
    apiCall(`/dashboard/notifications/${id}/read`, { method: 'PUT' })
};
