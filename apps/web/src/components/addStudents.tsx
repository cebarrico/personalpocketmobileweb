import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useStudentWithoutTeacher } from "@/hooks/use-student";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import { User } from "../../../../packages/supabase-client/types";

interface AddStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddStudentsModal: React.FC<AddStudentsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [filteredStudents, setFilteredStudents] = useState<User[]>([]);

  // Usar o hook apenas quando o modal estiver aberto
  const { student: studentWithoutTeacher, loading } =
    useStudentWithoutTeacher(isOpen);

  // Filtrar alunos baseado no nome digitado
  useEffect(() => {
    if (!studentWithoutTeacher) {
      setFilteredStudents([]);
      return;
    }

    if (!name.trim()) {
      setFilteredStudents(studentWithoutTeacher);
    } else {
      const filtered = studentWithoutTeacher.filter((student) =>
        student.full_name?.toLowerCase().includes(name.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  }, [name, studentWithoutTeacher]);

  // Resetar estado quando o modal fechar
  useEffect(() => {
    if (!isOpen) {
      setName("");
      setFilteredStudents([]);
    }
  }, [isOpen]);

  const handleAddStudent = async (studentId: string, studentName: string) => {
    if (!user?.id) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive",
      });
      return;
    }

    try {
      // Atualizar o teacher_id do aluno
      const { error } = await supabase
        .from("users")
        .update({ teacher_id: user.id })
        .eq("id", studentId);

      if (error) {
        console.error("Erro ao adicionar aluno:", error);
        toast({
          title: "Erro",
          description: "Erro ao adicionar aluno",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso!",
        description: `${studentName} foi adicionado à sua lista de alunos`,
      });

      // Remover o aluno da lista local
      setFilteredStudents((prev) => prev.filter((s) => s.id !== studentId));

      // Fechar modal se não há mais alunos
      if (filteredStudents.length === 1) {
        onClose();
      }
    } catch (error) {
      console.error("Erro inesperado:", error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao adicionar aluno",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dark-teal max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-ice-white">Adicionar Aluno</DialogTitle>
          <DialogDescription className="text-light-gray-text">
            Selecione um aluno sem professor para adicionar à sua lista
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="search" className="text-ice-white">
              Buscar por nome
            </Label>
            <Input
              id="search"
              type="text"
              placeholder="Nome do aluno"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-medium-blue-gray border-light-gray text-ice-white"
            />
          </div>

          <div className="max-h-96 overflow-y-auto">
            {name === "" ? (
              <div className="text-center py-8">
                <p className="text-light-gray-text">
                  Nenhum aluno sem professor encontrado
                </p>
              </div>
            ) : loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-aqua"></div>
                <span className="ml-2 text-light-gray-text">
                  Carregando alunos...
                </span>
              </div>
            ) : filteredStudents.length > 0 ? (
              <div className="space-y-3">
                {filteredStudents.map((student) => (
                  <Card
                    key={student.id}
                    className="bg-light-gray border-light-gray"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-ice-white">
                            {student.full_name}
                          </h3>
                          <p className="text-sm text-light-gray-text">
                            {student.email}
                          </p>
                          {student.phone && (
                            <p className="text-sm text-light-gray-text">
                              {student.phone}
                            </p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          className="bg-aqua hover:bg-aqua-dark text-dark-teal"
                          onClick={() =>
                            handleAddStudent(
                              student.id,
                              student.full_name || "Aluno"
                            )
                          }
                        >
                          Adicionar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-light-gray-text">
                  {name.trim()
                    ? "Nenhum aluno encontrado com esse nome"
                    : "Nenhum aluno sem professor encontrado"}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-light-gray text-light-gray-text hover:bg-light-gray"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
