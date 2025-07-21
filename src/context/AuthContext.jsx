import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedAdmin = localStorage.getItem('admin');
    const accessToken = localStorage.getItem('accessToken');
    
    if (savedAdmin && accessToken) {
      setAdmin(JSON.parse(savedAdmin));
    }
    setLoading(false);
  }, []);

  const login = (adminData) => {
    setAdmin(adminData.admin);
  };

  const logout = () => {
    localStorage.clear();
    setAdmin(null);
  };

  const isAuthenticated = () => {
    return !!admin && !!localStorage.getItem('accessToken');
  };

  const value = {
    admin,
    login,
    logout,
    isAuthenticated,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 