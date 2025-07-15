import React, { useState } from "react";
import { WorkoutModal } from "./WorkoutModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Dumbbell, Target, CheckCircle } from "lucide-react";

export const WorkoutModalExample: React.FC = () => {
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [savedWorkouts, setSavedWorkouts] = useState<string[]>([]);

  const weekDays = [
    { name: "Segunda", date: "2024-01-15" },
    { name: "Terça", date: "2024-01-16" },
    { name: "Quarta", date: "2024-01-17" },
    { name: "Quinta", date: "2024-01-18" },
    { name: "Sexta", date: "2024-01-19" },
    { name: "Sábado", date: "2024-01-20" },
    { name: "Domingo", date: "2024-01-21" },
  ];

  const openWorkoutModal = (day: string, date: string) => {
    setSelectedDay(day);
    setSelectedDate(date);
    setIsWorkoutModalOpen(true);
  };

  const closeWorkoutModal = () => {
    setIsWorkoutModalOpen(false);
    setSelectedDay("");
    setSelectedDate("");

    // Simular atualização dos workouts salvos
    if (selectedDay) {
      setSavedWorkouts((prev) => [...prev, selectedDay]);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-ice-white">
          Exemplo do Modal de Workout
        </h1>
        <p className="text-light-gray-text">
          Demonstração de como adicionar exercícios aos dias da semana
        </p>
      </div>

      <Card className="bg-light-gray border-light-gray">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-ice-white">
            <Target className="w-5 h-5" />
            Funcionalidades Implementadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-medium text-ice-white">
                  ✅ Recursos Disponíveis:
                </h3>
                <ul className="text-sm text-light-gray-text space-y-1">
                  <li>• Banco de 18 exercícios (6 grupos musculares)</li>
                  <li>• Filtros por músculo, dificuldade e equipamento</li>
                  <li>• Busca por nome do exercício</li>
                  <li>• Configuração de séries, repetições e peso</li>
                  <li>• Geração automática de treinos</li>
                  <li>• Salvamento no banco de dados Supabase</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-ice-white">
                  🔧 Integração com Hook:
                </h3>
                <ul className="text-sm text-light-gray-text space-y-1">
                  <li>• Função `addWorkoutToDay()` no use-workout.ts</li>
                  <li>• Detecção automática de treinos existentes</li>
                  <li>• Atualização vs. criação de novos treinos</li>
                  <li>• Sincronização com StudentProfile</li>
                  <li>• Estados de loading e error</li>
                  <li>• Validação de dados antes de salvar</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-light-gray border-light-gray">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-ice-white">
            <Calendar className="w-5 h-5" />
            Programação da Semana
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-light-gray-text">
              Clique em &quot;Adicionar Treino&quot; para abrir o modal e
              configurar exercícios para cada dia:
            </p>

            <div className="grid gap-3">
              {weekDays.map((day) => (
                <div
                  key={day.name}
                  className="flex items-center justify-between p-4 bg-medium-blue-gray rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-aqua" />
                      <span className="font-medium text-ice-white">
                        {day.name}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {day.date}
                    </Badge>
                    {savedWorkouts.includes(day.name) && (
                      <Badge className="bg-green-600 text-white text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Salvo
                      </Badge>
                    )}
                  </div>

                  <Button
                    onClick={() => openWorkoutModal(day.name, day.date)}
                    size="sm"
                    className="bg-aqua text-dark-teal hover:bg-aqua-dark"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Adicionar Treino
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-light-gray border-light-gray">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-ice-white">
            <Dumbbell className="w-5 h-5" />
            Fluxo de Funcionamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-medium text-ice-white">
                  1. Seleção de Exercícios
                </h3>
                <div className="text-sm text-light-gray-text space-y-2">
                  <p>• Navegue pelos exercícios disponíveis</p>
                  <p>• Use filtros para encontrar exercícios específicos</p>
                  <p>• Adicione exercícios à sua seleção</p>
                  <p>• Veja exercícios organizados por grupo muscular</p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium text-ice-white">2. Configuração</h3>
                <div className="text-sm text-light-gray-text space-y-2">
                  <p>• Configure séries, repetições e peso</p>
                  <p>• Defina tempo de descanso entre séries</p>
                  <p>• Adicione observações personalizadas</p>
                  <p>• Visualize duração estimada do treino</p>
                </div>
              </div>
            </div>

            <div className="border-t border-light-gray/20 pt-4">
              <h3 className="font-medium text-ice-white mb-2">
                3. Salvamento no Banco
              </h3>
              <div className="text-sm text-light-gray-text space-y-2">
                <p>• Dados são salvos na tabela `daily_workouts` do Supabase</p>
                <p>• Exercícios são associados ao `student_id` e `date`</p>
                <p>
                  • Sistema detecta treinos existentes e oferece atualização
                </p>
                <p>• StudentProfile é atualizado automaticamente</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-light-gray border-light-gray">
        <CardHeader>
          <CardTitle className="text-ice-white">
            Exemplo de Dados Salvos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-sm text-light-gray-text">
              <p className="font-medium text-ice-white mb-1">
                Estrutura do banco:
              </p>
              <pre className="bg-dark-teal/20 p-3 rounded text-xs overflow-x-auto">
                {`// Tabela: daily_workouts
{
  "id": "workout-1234567890",
  "student_id": "student-001",
  "date": "2024-01-15",
  "workout": {
    "id": "workout-1234567890",
    "name": "Treino Segunda",
    "description": "Treino programado para Segunda",
    "exercises": [
      {
        "exercise": {
          "id": "chest-001",
          "name": "Supino Reto",
          "muscle_group": "chest",
          "equipment": "Barra e banco"
        },
        "sets": [
          {
            "set_number": 1,
            "reps": 8,
            "weight": 60,
            "rest_time": 90,
            "notes": "Série de aquecimento"
          }
          // ... mais séries
        ],
        "notes": "Foco na técnica"
      }
      // ... mais exercícios
    ],
    "estimated_duration": 40,
    "difficulty_level": "intermediate",
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-15T10:00:00Z"
  },
  "notes": "Treino criado para Segunda"
}`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de workout */}
      <WorkoutModal
        isOpen={isWorkoutModalOpen}
        onClose={closeWorkoutModal}
        studentId="student-001"
        dayOfWeek={selectedDay}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default WorkoutModalExample;
