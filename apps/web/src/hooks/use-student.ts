import { User } from "./../../../../packages/supabase-client/types";

import { useEffect, useState } from "react";
import { supabase } from "../../supabase";

export const useStudent = (userId: string) => {
  const [student, setStudent] = useState<User[] | null>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);

    const fetchStudents = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("teacher_id", userId)
          .eq("role", "student");

        if (error) {
          console.error(error);
        }
        setStudent(data || []);
        setLoading(false);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [userId]);

  return { student, loading };
};

export const useStudentWithoutTeacher = (shouldFetch = false) => {
  const [student, setStudent] = useState<User[] | null>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!shouldFetch) return;

    setLoading(true);

    const fetchStudentsWithoutTeacher = async () => {
      try {
        console.log("🔍 Buscando alunos sem professor...");
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .is("teacher_id", null)
          .eq("role", "student");

        console.log("✅ Resultado da query:", data);
        console.log("Erro na query:", error);

        if (error) {
          console.error("Erro ao buscar alunos sem professor:", error);
          throw error;
        }

        setStudent(data || []);
      } catch (error) {
        console.error("Erro no try-catch:", error);
        setStudent([]);
      } finally {
        console.log("Finalizando loading...");
        setLoading(false);
      }
    };

    fetchStudentsWithoutTeacher();
  }, [shouldFetch]);

  return { student, loading };
};

export const useStudentById = (studentId: string) => {
  const [student, setStudent] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId) return;
    const fetchStudent = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", studentId)
        .single();

      if (error) {
        console.error(error);
      } else {
        setStudent(data);
      }
      setLoading(false);
    };

    fetchStudent();
  }, [studentId]);

  return { student, loading };
};
