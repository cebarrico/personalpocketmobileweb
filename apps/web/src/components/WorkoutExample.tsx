import React, { useState, useEffect } from "react";
import { useWorkout, useDayWorkout } from "../hooks/use-workout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Dumbbell } from "lucide-react";
import { DailyWorkout } from "@pocket-trainer-hub/supabase-client";

// Interface para o exercício no workout
interface WorkoutExercise {
  exercise: {
    name: string;
    [key: string]: unknown;
  };
  sets: {
    length: number;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

// Exemplo 1: Usar o hook básico para buscar treinos por dia
export const WorkoutByDayExample: React.FC = () => {
  const workout = useWorkout();
  const [selectedStudentId, setSelectedStudentId] =
    useState("student-uuid-123");
  const [selectedDate, setSelectedDate] = useState("2024-01-15");
  const [dayWorkouts, setDayWorkouts] = useState<DailyWorkout[]>([]);

  // Buscar treinos quando o componente montar ou dados mudarem
  useEffect(() => {
    const fetchWorkouts = async () => {
      if (selectedStudentId && selectedDate) {
        const workouts = await workout.getWorkoutsByDay(
          selectedStudentId,
          selectedDate
        );
        setDayWorkouts(workouts);
      }
    };

    fetchWorkouts();
  }, [selectedStudentId, selectedDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleStudentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStudentId(e.target.value);
  };

  if (workout.isLoading) {
    return <div>Carregando treinos...</div>;
  }

  if (workout.error) {
    return <div>Erro: {workout.error}</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Treinos por Dia - Exemplo Básico
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Controles */}
            <div className="flex gap-4">
              <div>
                <label
                  htmlFor="student-select"
                  className="block text-sm font-medium mb-1"
                >
                  Aluno:
                </label>
                <select
                  id="student-select"
                  value={selectedStudentId}
                  onChange={handleStudentChange}
                  className="border rounded px-3 py-2"
                >
                  <option value="student-uuid-123">João Silva</option>
                  <option value="student-uuid-456">Maria Santos</option>
                  <option value="student-uuid-789">Pedro Oliveira</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="date-input"
                  className="block text-sm font-medium mb-1"
                >
                  Data:
                </label>
                <input
                  id="date-input"
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  className="border rounded px-3 py-2"
                />
              </div>
            </div>

            {/* Resultados */}
            <div>
              <h3 className="font-medium mb-2">
                Treinos para {workout.formatWorkoutDate(selectedDate)}:
              </h3>
              {dayWorkouts.length === 0 ? (
                <p className="text-gray-500">
                  Nenhum treino encontrado para esta data.
                </p>
              ) : (
                <div className="space-y-3">
                  {dayWorkouts.map((dailyWorkout) => (
                    <WorkoutCard
                      key={dailyWorkout.id}
                      dailyWorkout={dailyWorkout}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Exemplo 2: Usar o hook específico para um dia (com auto-fetch)
export const AutoFetchWorkoutExample: React.FC = () => {
  const studentId = "student-uuid-123";
  const today = new Date().toISOString().split("T")[0];

  // Hook específico que busca automaticamente
  const workout = useDayWorkout(studentId, today);

  if (workout.isLoading) {
    return <div>Carregando treinos de hoje...</div>;
  }

  if (workout.error) {
    return <div>Erro: {workout.error}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Dumbbell className="w-5 h-5" />
          Treino de Hoje - Auto Fetch
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            Aluno: João Silva | Data: {workout.formatWorkoutDate(today)}
          </div>

          {workout.workouts.length === 0 ? (
            <p className="text-gray-500">Nenhum treino programado para hoje.</p>
          ) : (
            <div className="space-y-3">
              {workout.workouts.map((dailyWorkout) => (
                <WorkoutCard
                  key={dailyWorkout.id}
                  dailyWorkout={dailyWorkout}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Exemplo 3: Renderizar treinos da semana
export const WeeklyWorkoutExample: React.FC = () => {
  const workout = useWorkout();
  const [studentId] = useState("student-uuid-123");

  useEffect(() => {
    const fetchWeeklyWorkouts = async () => {
      await workout.getWorkoutsByWeek(studentId);
    };

    fetchWeeklyWorkouts();
  }, [studentId]);

  const groupedWorkouts = workout.getWorkoutsByWeekGrouped();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Treinos da Semana
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.keys(groupedWorkouts).length === 0 ? (
            <p className="text-gray-500">
              Nenhum treino encontrado para esta semana.
            </p>
          ) : (
            Object.entries(groupedWorkouts).map(([weekStart, workouts]) => (
              <div key={weekStart} className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">
                  Semana de {new Date(weekStart).toLocaleDateString("pt-BR")}
                </h4>
                <div className="space-y-2">
                  {workouts.map((dailyWorkout) => (
                    <div
                      key={dailyWorkout.id}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm">
                        {workout.formatWorkoutDate(dailyWorkout.date)}
                      </span>
                      <Badge variant="secondary">
                        {JSON.parse(dailyWorkout.workout as string).exercises
                          ?.length || 0}{" "}
                        exercícios
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Componente para renderizar um card de treino
const WorkoutCard: React.FC<{ dailyWorkout: DailyWorkout }> = ({
  dailyWorkout,
}) => {
  const workoutData = JSON.parse(dailyWorkout.workout as string);

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{workoutData.name}</CardTitle>
          <Badge variant="outline">{workoutData.difficulty_level}</Badge>
        </div>
        {workoutData.description && (
          <p className="text-sm text-gray-600">{workoutData.description}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Informações do treino */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {workoutData.estimated_duration}min
            </div>
            <div className="flex items-center gap-1">
              <Dumbbell className="w-4 h-4" />
              {workoutData.exercises?.length || 0} exercícios
            </div>
          </div>

          {/* Lista de exercícios */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Exercícios:</h4>
            <div className="space-y-1">
              {workoutData.exercises?.map(
                (exercise: WorkoutExercise, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>{exercise.exercise.name}</span>
                    <span className="text-gray-500">
                      {exercise.sets.length} séries
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Notas */}
          {dailyWorkout.notes && (
            <div className="text-sm">
              <span className="font-medium">Notas:</span>
              <p className="text-gray-600">{dailyWorkout.notes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Exemplo principal que combina todos os exemplos
export const WorkoutExampleContainer: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">
          Exemplos de Uso do Hook use-workout
        </h1>
        <p className="text-gray-600">
          Demonstrações de como usar o hook para renderizar treinos por dia do
          aluno
        </p>
      </div>

      <div className="grid gap-8">
        <WorkoutByDayExample />
        <AutoFetchWorkoutExample />
        <WeeklyWorkoutExample />
      </div>
    </div>
  );
};

export default WorkoutExampleContainer;
