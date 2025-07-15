"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const router = useRouter();
  const { userProfile, user } = useAuth();

  useEffect(() => {
    if (userProfile && user) {
      // Redirecionar baseado no role do usuário
      if (user.role === "teacher") {
        router.push("/teacher-dashboard");
      } else {
        router.push("/student-dashboard");
      }
    } else {
      router.push("/login");
    }
  }, [userProfile, user, router]);

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aqua mx-auto mb-4"></div>
        <p className="text-light-gray-text">Carregando Personal Pocket...</p>
      </div>
    </div>
  );
};

export default Index;
