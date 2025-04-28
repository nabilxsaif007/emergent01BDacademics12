import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if token exists in localStorage
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Set axios default headers for all requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Get user info from token (we'll decode the data we stored)
          const userData = JSON.parse(localStorage.getItem('user'));
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Error checking authentication:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API}/token`, new URLSearchParams({
        'username': email,
        'password': password,
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const { access_token, user_id, role } = response.data;

      // Store token and user data
      localStorage.setItem('token', access_token);
      const userData = { id: user_id, email, role };
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Set axios default headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      setUser(userData);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.detail || 'Failed to login. Please check your credentials.'
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await axios.post(`${API}/register`, {
        name,
        email,
        password,
        role: 'user'
      });
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.response?.data?.detail || 'Failed to register. Please try again.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
