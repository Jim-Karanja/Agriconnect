// API Configuration
const API_CONFIG = {
  // Backend URL - change this when deploying
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://agriconnect-oryp.onrender.com'  // Production URL
    : 'http://localhost:8080',                   // Development URL
  
  // API Endpoints
  ENDPOINTS: {
    MPESA_PAYMENT: '/payment/mpesa',
    MPESA_STATUS: '/payment/mpesa/status',
    TRANSACTIONS: '/payment/transactions',
    INVESTORS: '/investors',
    STARTUPS: '/startups',
    USERS: '/users'
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Specific API URLs
export const API_URLS = {
  MPESA_PAYMENT: getApiUrl(API_CONFIG.ENDPOINTS.MPESA_PAYMENT),
  MPESA_STATUS: getApiUrl(API_CONFIG.ENDPOINTS.MPESA_STATUS),
  TRANSACTIONS: getApiUrl(API_CONFIG.ENDPOINTS.TRANSACTIONS),
  INVESTORS: getApiUrl(API_CONFIG.ENDPOINTS.INVESTORS),
  STARTUPS: getApiUrl(API_CONFIG.ENDPOINTS.STARTUPS),
  USERS: getApiUrl(API_CONFIG.ENDPOINTS.USERS)
};

export default API_CONFIG;
