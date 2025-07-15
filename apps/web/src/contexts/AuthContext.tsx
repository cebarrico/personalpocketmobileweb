"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createClientComponentClient } from "@/lib/supabase";
import { signOut as serverSignOut } from "@/lib/auth-actions";
import type { User } from "@supabase/supabase-js";
import { RegisterForm } from "../../../../packages/supabase-client/types";
import { supabase } from "../../supabase";

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: "teacher" | "student";
}

interface AuthContextType {
  user: UserProfile | null;
  userProfile: UserProfile | null; // Manter compatibilidade
  loading: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: string | null }>;
  signUp: (formData: RegisterForm) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Função para buscar dados do usuário
    const fetchUserProfile = async (authUser: User) => {
      try {
        // Buscar dados da tabela users
        const { data: userProfile } = await supabase
          .from("users")
          .select("id, email, full_name, role")
          .eq("id", authUser.id)
          .single();

        if (userProfile) {
          return userProfile as UserProfile;
        }

        // Fallback para usuários que não estão na tabela users
        return {
          id: authUser.id,
          email: authUser.email || "unknown@email.com",
          full_name:
            authUser.user_metadata?.full_name ||
            authUser.email?.split("@")[0] ||
            "Usuário",
          role:
            (authUser.user_metadata?.role as "teacher" | "student") ||
            "student",
        } as UserProfile;
      } catch (error) {
        console.error("Erro ao buscar perfil do usuário:", error);
        return null;
      }
    };

    // Configurar listener para mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "INITIAL_SESSION") {
        // Sessão inicial - verificar se há usuário
        if (session?.user) {
          const userProfile = await fetchUserProfile(session.user);
          setUser(userProfile);
        } else {
          setUser(null);
        }
        setInitialized(true);
        setLoading(false);
      } else if (event === "SIGNED_IN" && session?.user) {
        const userProfile = await fetchUserProfile(session.user);
        setUser(userProfile);
        if (initialized) {
          setLoading(false);
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        if (initialized) {
          setLoading(false);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [initialized]);

  const signIn = async (email: string, password: string) => {
    try {
      const supabase = createClientComponentClient();

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      // O listener irá atualizar o estado do usuário
      return { error: null };
    } catch (error) {
      console.error("Erro no login:", error);
      return { error: "Erro inesperado no login" };
    }
  };
  const signUp = async (formData: RegisterForm) => {
    console.log(formData);

    try {
      // 0. Verifica se o CPF já existe
      const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("id")
        .eq("cpf", formData.cpf)
        .maybeSingle(); // evita erro se não encontrar

      if (existingUser) {
        return { error: "Este CPF já está cadastrado." };
      }

      if (fetchError) {
        console.error("Erro ao verificar CPF:", fetchError);
        return { error: "Erro ao verificar CPF." };
      }
      // 1. Cria o usuário no auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (signUpError) {
        return { error: signUpError.message };
      }

      const userId = data.user?.id;

      if (!userId) {
        return { error: "Erro ao obter ID do usuário após cadastro." };
      }

      // 2. Insere dados adicionais na tabela "users"
      const { error: insertError } = await supabase.from("users").insert([
        {
          id: userId,
          full_name: formData.full_name,
          email: formData.email,
          role: formData.role,
          cpf: formData.cpf,
          phone: formData.phone,
          birth_date: formData.birth_date,
        },
      ]);

      if (insertError) {
        return { error: insertError.message };
      }

      return { error: null };
    } catch (error) {
      console.error("Erro no registro:", error);
      return { error: "Erro inesperado no registro" };
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);

      // Fazer logout no cliente
      await supabase.auth.signOut();

      // Usar server action para garantir que os cookies sejam limpos
      await serverSignOut();

      setUser(null);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    userProfile: user, // Manter compatibilidade
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
