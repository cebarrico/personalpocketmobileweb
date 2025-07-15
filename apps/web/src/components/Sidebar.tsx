"use client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Home,
  Calendar,
  Users,
  TrendingUp,
  LogOut,
  Dumbbell,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import logo from "../../public/logo.png";

interface SidebarProps {
  activeView: string;
  onViewChange: (
    view: "dashboard" | "calendar" | "students" | "evolution"
  ) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onViewChange,
  isOpen,
  onToggle,
}) => {
  const { user, signOut } = useAuth();
  const router = useRouter();

  // Redirecionar para login quando usuário fizer logout
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "calendar", label: "Calendário", icon: Calendar },
    { id: "students", label: "Alunos", icon: Users },
    { id: "evolution", label: "Evolução", icon: TrendingUp },
  ];

  const handleMenuItemClick = (
    view: "dashboard" | "calendar" | "students" | "evolution"
  ) => {
    onViewChange(view);
    // Fechar sidebar em mobile após selecionar item
    if (window.innerWidth < 768) {
      onToggle();
    }
  };

  const handleLogout = async () => {
    router.push("/login");
    await signOut();
  };

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed left-0 top-0 z-50 w-64 h-screen bg-medium-blue-gray border-r border-light-gray flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
      >
        {/* Header */}
        <div className="p-6 border-b border-light-gray">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-aqua/10 p-2 rounded-xl">
                <Image src={logo} alt="logo" className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-ice-white">
                  Personal Pocket
                </h1>
                <p className="text-sm text-light-gray-text">Dashboard</p>
              </div>
            </div>
            {/* Botão de fechar para mobile */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-light-gray-text hover:text-ice-white"
              onClick={onToggle}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;

              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start text-left ${
                    isActive
                      ? "bg-aqua text-dark-teal hover:bg-aqua-dark"
                      : "text-light-gray-text hover:text-ice-white hover:bg-light-gray/50"
                  }`}
                  onClick={() =>
                    handleMenuItemClick(
                      item.id as
                        | "dashboard"
                        | "calendar"
                        | "students"
                        | "evolution"
                    )
                  }
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </div>
        </nav>

        {/* Profile */}
        <div className="p-4 border-t border-light-gray">
          <div className="flex items-center space-x-3 mb-4">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-aqua text-dark-teal">
                {user?.full_name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ice-white truncate">
                {user?.full_name || "Usuário"}
              </p>
              <p className="text-xs text-light-gray-text truncate">
                {user?.email || "email@exemplo.com"}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            className="w-full justify-start text-coral-red hover:text-coral-red hover:bg-coral-red/10"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
    </>
  );
};
