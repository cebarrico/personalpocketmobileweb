import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Edit,
  Calendar,
  History,
  TrendingUp,
  User,
  Dumbbell,
  Clock,
  Coffee,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useStudentById } from "@/hooks/use-student";
import { useWorkout } from "@/hooks/use-workout";
import { WorkoutModal } from "./WorkoutModal";
import { DailyWorkout } from "@pocket-trainer-hub/supabase-client";

interface StudentProfileProps {
  studentId: string;
  onBack: () => void;
}

const weekDays = [
  { name: "Segunda", dayNumber: 1 },
  { name: "Terça", dayNumber: 2 },
  { name: "Quarta", dayNumber: 3 },
  { name: "Quinta", dayNumber: 4 },
  { name: "Sexta", dayNumber: 5 },
  { name: "Sábado", dayNumber: 6 },
  { name: "Domingo", dayNumber: 0 },
];

// Função para obter a data do próximo dia da semana
const getNextDayOfWeek = (dayNumber: number): string => {
  const today = new Date();
  const currentDay = today.getDay();
  const daysUntilNext = (dayNumber - currentDay + 7) % 7;
  const nextDay = new Date(today);
  nextDay.setDate(today.getDate() + daysUntilNext);
  return nextDay.toISOString().split("T")[0];
};

// Interface para exercício do workout
interface WorkoutExercise {
  exercise?: {
    muscle_group?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

// Função para agrupar exercícios por grupo muscular
const groupExercisesByMuscleGroup = (
  exercises: WorkoutExercise[]
): string[] => {
  const groups = new Set<string>();
  exercises.forEach((exercise) => {
    if (exercise.exercise?.muscle_group) {
      groups.add(exercise.exercise.muscle_group);
    }
  });
  return Array.from(groups);
};

// Função para traduzir grupos musculares
const translateMuscleGroup = (group: string): string => {
  const translations: { [key: string]: string } = {
    chest: "Peito",
    back: "Costas",
    shoulders: "Ombros",
    arms: "Braços",
    legs: "Pernas",
    abs: "Abdômen",
    biceps: "Bíceps",
    triceps: "Tríceps",
    quadriceps: "Quadríceps",
    hamstrings: "Posteriores",
    glutes: "Glúteos",
    calves: "Panturrilhas",
  };
  return translations[group] || group;
};

export const StudentProfile: React.FC<StudentProfileProps> = ({
  studentId,
  onBack,
}) => {
  const { student, loading } = useStudentById(studentId);
  const workout = useWorkout();

  // Estados para o modal de workout
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // Estado para armazenar os workouts de cada dia
  const [weeklyWorkouts, setWeeklyWorkouts] = useState<{
    [key: string]: DailyWorkout[];
  }>({});

  // Buscar workouts da semana quando o componente carregar
  useEffect(() => {
    const fetchWeeklyWorkouts = async () => {
      if (!studentId) return;

      const workoutsData: { [key: string]: DailyWorkout[] } = {};

      // Buscar workouts para cada dia da semana
      for (const day of weekDays) {
        const date = getNextDayOfWeek(day.dayNumber);
        const dayWorkouts = await workout.getWorkoutsByDayQuiet(
          studentId,
          date
        );
        workoutsData[day.name] = dayWorkouts;
      }

      setWeeklyWorkouts(workoutsData);
    };

    fetchWeeklyWorkouts();
  }, [studentId]);

  // Função para abrir o modal de workout
  const openWorkoutModal = (day: string) => {
    setSelectedDay(day);
    const dayInfo = weekDays.find((d) => d.name === day);
    if (dayInfo) {
      const date = getNextDayOfWeek(dayInfo.dayNumber);
      setSelectedDate(date);
    }
    setIsWorkoutModalOpen(true);
  };

  // Função para recarregar workouts
  const refetchWorkouts = async () => {
    if (!studentId) return;

    console.log("🔄 Recarregando workouts para todos os dias...");
    const workoutsData: { [key: string]: DailyWorkout[] } = {};

    for (const day of weekDays) {
      const date = getNextDayOfWeek(day.dayNumber);
      const dayWorkouts = await workout.getWorkoutsByDayQuiet(studentId, date);
      workoutsData[day.name] = dayWorkouts;
      console.log(`📅 ${day.name}: ${dayWorkouts.length} treinos`);
    }

    setWeeklyWorkouts(workoutsData);
    console.log("✅ Workouts atualizados no estado");
  };

  // Função para fechar o modal
  const closeWorkoutModal = () => {
    setIsWorkoutModalOpen(false);
    setSelectedDay("");
    setSelectedDate("");
  };

  // Função chamada quando um treino é salvo
  const onWorkoutSaved = () => {
    console.log("🔄 Treino salvo, atualizando lista de workouts...");
    // Forçar atualização dos workouts após salvar
    setTimeout(() => {
      refetchWorkouts();
    }, 500); // Delay maior para garantir que o banco foi atualizado
  };

  // Função para renderizar o conteúdo do treino de cada dia
  const renderWorkoutDay = (day: string) => {
    const dayWorkouts = weeklyWorkouts[day] || [];

    if (dayWorkouts.length === 0) {
      return (
        <div className="flex items-center space-x-2 text-light-gray-text">
          <Coffee className="h-4 w-4" />
          <span>Dia de descanso</span>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {dayWorkouts.map((dailyWorkout) => {
          // Verificar se workout é string JSON ou objeto
          let workoutData;
          try {
            workoutData =
              typeof dailyWorkout.workout === "string"
                ? JSON.parse(dailyWorkout.workout)
                : dailyWorkout.workout;
          } catch (error) {
            console.error("Erro ao parsear workout:", error);
            workoutData = { exercises: [] };
          }

          const muscleGroups = groupExercisesByMuscleGroup(
            workoutData.exercises || []
          );
          const exerciseCount = workoutData.exercises?.length || 0;

          return (
            <div key={dailyWorkout.id} className="space-y-2">
              <div className="flex items-center space-x-2">
                <Dumbbell className="h-4 w-4 text-aqua" />
                <span className="text-ice-white font-medium">
                  {workoutData.name}
                </span>
              </div>

              <div className="flex items-center space-x-2 text-sm text-light-gray-text">
                <Clock className="h-3 w-3" />
                <span>{workoutData.estimated_duration || 0} min</span>
                <span>•</span>
                <span>{exerciseCount} exercícios</span>
              </div>

              {muscleGroups.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {muscleGroups.map((group) => (
                    <Badge
                      key={group}
                      variant="secondary"
                      className="text-xs bg-aqua/20 text-aqua border-aqua/30"
                    >
                      {translateMuscleGroup(group)}
                    </Badge>
                  ))}
                </div>
              )}

              {workoutData.description && (
                <p className="text-xs text-light-gray-text">
                  {workoutData.description}
                </p>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (loading || !student) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-light-gray-text hover:text-ice-white hover:bg-light-gray/50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
        <Card className="bg-light-gray border-light-gray">
          <CardContent className="p-8 text-center">
            <div className="bg-medium-blue-gray rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <User className="h-8 w-8 text-light-gray-text" />
            </div>
            <p className="text-light-gray-text">
              {loading
                ? "Carregando dados do aluno..."
                : "Aluno não encontrado"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-light-gray-text hover:text-ice-white hover:bg-light-gray/50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>
      {student && (
        <>
          {/* Student Header */}
          <Card className="bg-light-gray border-light-gray aqua-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={student.avatar_url}
                      alt={student.full_name}
                    />
                    <AvatarFallback className="bg-aqua/20 text-aqua text-xl">
                      {student.full_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-2xl font-bold text-ice-white">
                      {student.full_name}
                    </h1>
                    <p className="text-light-gray-text">
                      {student.email || "Email não disponível"}
                    </p>
                    <p className="text-light-gray-text">
                      {student.phone || "Telefone não disponível"}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-sm">
                      <span className="text-light-gray-text">
                        Idade:{" "}
                        <span className="text-ice-white font-medium">
                          {student.birth_date
                            ? new Date().getFullYear() -
                              new Date(student.birth_date).getFullYear()
                            : "N/A"}{" "}
                          anos
                        </span>
                      </span>
                      <span className="text-light-gray-text">Início: </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-medium-blue-gray rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-sm text-light-gray-text">Objetivo:</p>
                  <p className="text-ice-white">
                    {student.goal || "Objetivo não definido"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-aqua hover:text-aqua-dark"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      <Tabs defaultValue="workouts" className="space-y-4">
        <TabsList className="bg-medium-blue-gray border-light-gray">
          <TabsTrigger
            value="workouts"
            className="data-[state=active]:bg-aqua data-[state=active]:text-dark-teal"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Treinos
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="data-[state=active]:bg-aqua data-[state=active]:text-dark-teal"
          >
            <History className="h-4 w-4 mr-2" />
            Histórico
          </TabsTrigger>
          <TabsTrigger
            value="evolution"
            className="data-[state=active]:bg-aqua data-[state=active]:text-dark-teal"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Evolução
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workouts" className="space-y-4">
          <div className="grid gap-4">
            {weekDays.map((day) => (
              <Card key={day.name} className="bg-light-gray border-light-gray">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-ice-white">{day.name}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-aqua hover:text-aqua-dark"
                      onClick={() => openWorkoutModal(day.name)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {workout.isLoading ? (
                    <div className="flex items-center space-x-2 text-light-gray-text">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-aqua"></div>
                      <span>Carregando treinos...</span>
                    </div>
                  ) : (
                    renderWorkoutDay(day.name)
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card className="bg-light-gray border-light-gray">
            <CardContent className="p-8 text-center">
              <History className="h-12 w-12 text-light-gray-text mx-auto mb-4" />
              <p className="text-light-gray-text">
                Histórico de treinos em desenvolvimento
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evolution" className="space-y-4">
          <Card className="bg-light-gray border-light-gray">
            <CardContent className="p-8 text-center">
              <TrendingUp className="h-12 w-12 text-light-gray-text mx-auto mb-4" />
              <p className="text-light-gray-text">
                Gráficos de evolução em desenvolvimento
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de workout */}
      <WorkoutModal
        isOpen={isWorkoutModalOpen}
        onClose={closeWorkoutModal}
        onSave={onWorkoutSaved}
        studentId={studentId}
        dayOfWeek={selectedDay}
        selectedDate={selectedDate}
      />
    </div>
  );
};
