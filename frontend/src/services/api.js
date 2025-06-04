import axios from 'axios';

// 🚫 بلا .env
// ✅ Hardcoded baseURL
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // ✅ statique
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;
