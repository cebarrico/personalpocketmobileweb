"use client";

import { useAuth } from "@/contexts/AuthContext";

export function ClientAuthInfo() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 bg-aqua rounded-full animate-pulse"></div>
        <span className="text-light-gray-text">Carregando...</span>
      </div>
    );
  }

  if (!user) {
    return <p className="text-coral-red">Usuário não autenticado no cliente</p>;
  }

  return (
    <div className="space-y-2">
      <p className="text-ice-white">
        <span className="font-medium">Nome:</span> {user.full_name}
      </p>
      <p className="text-ice-white">
        <span className="font-medium">Email:</span> {user.email}
      </p>
      <p className="text-ice-white">
        <span className="font-medium">Role:</span> {user.role}
      </p>
      <p className="text-ice-white">
        <span className="font-medium">ID:</span> {user.id}
      </p>
      <div className="mt-2 text-xs text-light-gray-text">
        Dados obtidos via AuthContext (Client Component)
      </div>
    </div>
  );
}
