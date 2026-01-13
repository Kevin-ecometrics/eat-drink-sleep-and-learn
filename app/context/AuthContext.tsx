/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface AuthContextProps {
  isLogged: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem("app_session");
    if (session === "true") setIsLogged(true);
  }, []);

  const login = async (email: string, password: string) => {
    const validEmail = process.env.NEXT_PUBLIC_AUTH_EMAIL;
    const validPassword = process.env.NEXT_PUBLIC_AUTH_PASSWORD;

    if (email === validEmail && password === validPassword) {
      localStorage.setItem("app_session", "true");
      setIsLogged(true);
      return;
    } else {
      throw new Error("Credenciales incorrectas");
    }
  };

  const logout = () => {
    localStorage.removeItem("app_session");
    setIsLogged(false);
  };

  return (
    <AuthContext.Provider value={{ isLogged, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};
