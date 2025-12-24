import { createContext, useContext, useEffect, useState } from "react";
import api, { setAccessToken, clearAccessToken } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .post("/auth/refresh")
      .then((res) => {
        setAccessToken(res.data.access_token);
        setIsAuth(true);
      })
      .catch(() => {
        clearAccessToken();
        setIsAuth(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = (token) => {
    setAccessToken(token);
    setIsAuth(true);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {}
    clearAccessToken();
    setIsAuth(false);
  };

  return (
    <AuthContext.Provider value={{ isAuth, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
