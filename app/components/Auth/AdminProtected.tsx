/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLogged } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLogged) router.push("/login");
  }, [isLogged]);

  if (!isLogged) return <p className="p-6">Verificando acceso...</p>;

  return <>{children}</>;
}
