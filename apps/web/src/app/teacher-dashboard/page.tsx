"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Calendar } from "@/components/Calendar";
import { StudentsList } from "@/components/StudentsList";
import { TodayStudents } from "@/components/TodayStudents";
import { StudentProfile } from "@/components/StudentProfile";
import { EvolutionCharts } from "@/components/EvolutionCharts";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type ActiveView = "dashboard" | "calendar" | "students" | "evolution";

const TeacherDashboard = () => {
  const { loading } = useAuth();
  const [activeView, setActiveView] = useState<ActiveView>("dashboard");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleStudentSelect = (studentId: string) => {
    setSelectedStudentId(studentId);
    setActiveView("students");
  };

  const handleBackToStudents = () => {
    setSelectedStudentId(null);
  };

  // Renderizar conteúdo baseado na view ativa
  const renderContent = () => {
    if (selectedStudentId) {
      return (
        <StudentProfile
          studentId={selectedStudentId}
          onBack={handleBackToStudents}
        />
      );
    }

    switch (activeView) {
      case "dashboard":
        return <TodayStudents />;
      case "calendar":
        return <Calendar />;
      case "students":
        return <StudentsList onSelectStudent={handleStudentSelect} />;
      case "evolution":
        return <EvolutionCharts />;
      default:
        return <TodayStudents />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aqua mx-auto mb-4"></div>
          <p className="text-light-gray-text">Carregando Personal Pocket...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen gradient-bg">
      {/* Mobile Header */}
      <div className="md:hidden bg-medium-blue-gray border-b border-light-gray p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-ice-white">
            Personal Pocket
          </h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-light-gray-text hover:text-ice-white"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          activeView={activeView}
          onViewChange={setActiveView}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Main Content */}
        <div className="flex-1 md:ml-64 p-6 overflow-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
