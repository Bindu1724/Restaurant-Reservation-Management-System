
import { createContext, useContext, useState } from 'react';
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name');
    return role ? { role, name } : null;
  });
  const loginUser = ({ token, role, name }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('name', name);
    setUser({ role, name });
  };
  const logout = () => {
    localStorage.clear();
    setUser(null);
  };
  return <AuthContext.Provider value={{ user, loginUser, logout }}>{children}</AuthContext.Provider>;
}