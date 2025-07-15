import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search, User, Mail, Phone, Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import { useStudent } from "../hooks/use-student";
import { useAuth } from "../contexts/AuthContext";
import { AddStudentsModal } from "./addStudents";

// Dados mockados para desenvolvimento

interface StudentsListProps {
  onSelectStudent: (studentId: string) => void;
}

export const StudentsList: React.FC<StudentsListProps> = ({
  onSelectStudent,
}) => {
  const { user } = useAuth();
  const userId = user?.id;
  const { student, loading } = useStudent(userId || "");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddStudentsModalOpen, setIsAddStudentsModalOpen] = useState(false);

  const filteredStudents = student?.filter(
    (student) =>
      student.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      case "inactive":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Ativo";
      case "inactive":
        return "Inativo";
      default:
        return "Desconhecido";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-3xl font-bold text-ice-white mb-2"
            onClick={() => console.log(student)}
          >
            Meus Alunos
          </h1>
          <p className="text-light-gray-text">
            Gerencie seus alunos e acompanhe o progresso
          </p>
          <Button
            className="mt-4"
            onClick={() => setIsAddStudentsModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Adicionar aluno
          </Button>
        </div>
        <Badge className="bg-aqua/20 text-aqua border-aqua/50">
          {student!.length} alunos
        </Badge>
      </div>

      {/* Search Bar */}
      <Card className="bg-light-gray border-light-gray">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-light-gray-text" />
            <Input
              placeholder="Buscar alunos por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-dark-teal border-light-gray text-ice-white placeholder:text-light-gray-text"
            />
          </div>
        </CardContent>
      </Card>

      {/* Students Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-aqua" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {student!.map((student) => (
            <Card
              key={student.id}
              className="bg-light-gray border-light-gray hover:border-aqua/50 transition-all duration-200 cursor-pointer hover-scale"
              onClick={() => onSelectStudent(student.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-aqua text-dark-teal">
                      {student.full_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <Badge className={getStatusColor(student.status || "")}>
                    {getStatusText(student.status || "")}
                  </Badge>
                </div>
                <CardTitle className="text-ice-white text-lg">
                  {student.full_name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2 text-light-gray-text">
                    <Mail className="h-4 w-4" />
                    <span>{student.email}</span>
                  </div>
                  {student.phone && (
                    <div className="flex items-center space-x-2 text-light-gray-text">
                      <Phone className="h-4 w-4" />
                      <span>{student.phone}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-light-gray">
                  <div className="text-sm">
                    <span className="text-aqua font-medium">Objetivo:</span>
                    <p className="text-light-gray-text mt-1">{student.goal}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs text-light-gray-text">
                    Desde {formatDate(student.created_at || "")}
                  </span>
                  <Button
                    size="sm"
                    className="bg-aqua hover:bg-aqua/80 text-dark-teal"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectStudent(student.id);
                    }}
                  >
                    <User className="h-4 w-4 mr-1" />
                    Ver Perfil
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {filteredStudents!.length === 0 && !loading && (
        <Card className="bg-light-gray border-light-gray">
          <CardContent className="text-center py-12">
            <User className="h-12 w-12 text-light-gray-text mx-auto mb-4" />
            <h3 className="text-lg font-medium text-ice-white mb-2">
              {searchTerm
                ? "Nenhum aluno encontrado"
                : "Nenhum aluno cadastrado"}
            </h3>
            <p className="text-light-gray-text">
              {searchTerm
                ? "Tente ajustar os termos de busca"
                : "Você ainda não tem alunos cadastrados"}
            </p>
          </CardContent>
        </Card>
      )}
      <AddStudentsModal
        isOpen={isAddStudentsModalOpen}
        onClose={() => setIsAddStudentsModalOpen(false)}
      />
    </div>
  );
};
