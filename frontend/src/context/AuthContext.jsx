import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

// Context = cara React berbagi data ke semua komponen tanpa prop drilling
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cek apakah user sudah login saat app pertama dibuka
  useEffect(() => {
    const token = localStorage.getItem('devlog_token');
    if (token) {
      authAPI.getProfile()
        .then(res => setUser(res.data.user))
        .catch(() => localStorage.removeItem('devlog_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    localStorage.setItem('devlog_token', res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await authAPI.register({ name, email, password });
    localStorage.setItem('devlog_token', res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('devlog_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook — cara mudah pakai AuthContext
export const useAuth = () => useContext(AuthContext);
