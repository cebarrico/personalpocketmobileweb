"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dumbbell,
  TrendingUp,
  LogOut,
  Timer,
  Play,
  Activity,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const mockTodayWorkout = [
  {
    id: 1,
    exercise: "Supino Reto",
    sets: 4,
    reps: "10-12",
    weight: "80kg",
    completed: false,
    rest: "2 min",
  },
  {
    id: 2,
    exercise: "Agachamento",
    sets: 3,
    reps: "15",
    weight: "100kg",
    completed: false,
    rest: "90s",
  },
  {
    id: 3,
    exercise: "Remada Curvada",
    sets: 4,
    reps: "12",
    weight: "70kg",
    completed: false,
    rest: "2 min",
  },
];

const mockStats = {
  totalWorkouts: 24,
  completedThisWeek: 3,
  currentStreak: 5,
  nextGoal: "Perder 2kg",
};

const StudentDashboard = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [workoutItems, setWorkoutItems] = useState(mockTodayWorkout);

  // Redirecionar para login quando usuário fizer logout
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  const logout = async () => {
    await signOut();
    router.push("/login");
  };

  const toggleExerciseCompletion = (id: number) => {
    setWorkoutItems(
      workoutItems.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const completedExercises = workoutItems.filter(
    (item) => item.completed
  ).length;
  const totalExercises = workoutItems.length;

  if (!user) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aqua mx-auto mb-4"></div>
          <p className="text-light-gray-text">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-ice-white">Dashboard</h1>
            <p className="text-light-gray-text">
              Bem-vindo de volta, {user.full_name}!
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={signOut}
              className="text-coral-red hover:text-coral-red hover:bg-coral-red/10"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-light-gray border-light-gray">
            <CardHeader className="pb-3">
              <CardTitle className="text-ice-white text-sm">
                Total de Treinos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-aqua">
                {mockStats.totalWorkouts}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-light-gray border-light-gray">
            <CardHeader className="pb-3">
              <CardTitle className="text-ice-white text-sm">
                Esta Semana
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-aqua">
                {mockStats.completedThisWeek}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-light-gray border-light-gray">
            <CardHeader className="pb-3">
              <CardTitle className="text-ice-white text-sm">
                Sequência Atual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-aqua">
                {mockStats.currentStreak} dias
              </div>
            </CardContent>
          </Card>

          <Card className="bg-light-gray border-light-gray">
            <CardHeader className="pb-3">
              <CardTitle className="text-ice-white text-sm">
                Próxima Meta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-aqua font-semibold">
                {mockStats.nextGoal}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Workout */}
        <Card className="bg-light-gray border-light-gray mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-ice-white flex items-center">
                <Dumbbell className="h-5 w-5 mr-2 text-aqua" />
                Treino de Hoje
              </CardTitle>
              <Badge className="bg-aqua/20 text-aqua border-aqua/50">
                {completedExercises}/{totalExercises} completos
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workoutItems.map((exercise) => (
                <div
                  key={exercise.id}
                  className={`p-4 rounded-lg border transition-all ${
                    exercise.completed
                      ? "bg-green-500/20 border-green-500/50"
                      : "bg-medium-blue-gray border-light-gray"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Button
                        size="sm"
                        variant={exercise.completed ? "default" : "outline"}
                        onClick={() => toggleExerciseCompletion(exercise.id)}
                        className={
                          exercise.completed
                            ? "bg-green-500 hover:bg-green-600"
                            : "border-aqua text-aqua hover:bg-aqua/10"
                        }
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                      <div>
                        <h3 className="font-semibold text-ice-white">
                          {exercise.exercise}
                        </h3>
                        <p className="text-sm text-light-gray-text">
                          {exercise.sets} séries • {exercise.reps} reps •{" "}
                          {exercise.weight}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Timer className="h-4 w-4 text-light-gray-text" />
                      <span className="text-sm text-light-gray-text">
                        {exercise.rest}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-light-gray border-light-gray">
            <CardHeader>
              <CardTitle className="text-ice-white flex items-center">
                <Activity className="h-5 w-5 mr-2 text-aqua" />
                Histórico de Treinos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-light-gray-text mb-4">
                Veja seus treinos anteriores e progresso
              </p>
              <Button
                className="bg-aqua hover:bg-aqua-dark text-dark-teal"
                onClick={() => console.log("Ver histórico")}
              >
                Ver Histórico
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-light-gray border-light-gray">
            <CardHeader>
              <CardTitle className="text-ice-white flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-aqua" />
                Evolução
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-light-gray-text mb-4">
                Acompanhe seu progresso e evolução
              </p>
              <Button
                className="bg-aqua hover:bg-aqua-dark text-dark-teal"
                onClick={() => console.log("Ver evolução")}
              >
                Ver Evolução
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
