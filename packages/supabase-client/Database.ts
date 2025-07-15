export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)";
  };
  public: {
    Tables: {
      appointments: {
        Row: {
          created_at: string | null;
          date: string;
          id: string;
          notes: string | null;
          status: string | null;
          student_id: string | null;
          student_type: string | null;
          teacher_id: string | null;
          time: string | null;
        };
        Insert: {
          created_at?: string | null;
          date: string;
          id?: string;
          notes?: string | null;
          status?: string | null;
          student_id?: string | null;
          student_type?: string | null;
          teacher_id?: string | null;
          time?: string | null;
        };
        Update: {
          created_at?: string | null;
          date?: string;
          id?: string;
          notes?: string | null;
          status?: string | null;
          student_id?: string | null;
          student_type?: string | null;
          teacher_id?: string | null;
          time?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "appointments_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "appointments_teacher_id_fkey";
            columns: ["teacher_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      daily_workouts: {
        Row: {
          created_at: string | null;
          date: string;
          id: string;
          notes: string | null;
          student_id: string | null;
          workout: Json;
        };
        Insert: {
          created_at?: string | null;
          date: string;
          id?: string;
          notes?: string | null;
          student_id?: string | null;
          workout: Json;
        };
        Update: {
          created_at?: string | null;
          date?: string;
          id?: string;
          notes?: string | null;
          student_id?: string | null;
          workout?: Json;
        };
        Relationships: [
          {
            foreignKeyName: "daily_workouts_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      users: {
        Row: {
          avatar_url: string | null;
          birth_date: string | null;
          body_fat_percent: number | null;
          body_measurements: Json | null;
          cpf: string | null;
          created_at: string | null;
          cref: string | null;
          email: string | null;
          full_name: string;
          gender: string | null;
          goal: string | null;
          height_cm: number | null;
          id: string;
          last_assessment: string | null;
          phone: string | null;
          prebuilt_workout: Json | null;
          role: string;
          status: string | null;
          teacher_id: string | null;
          weight_kg: number | null;
        };
        Insert: {
          avatar_url?: string | null;
          birth_date?: string | null;
          body_fat_percent?: number | null;
          body_measurements?: Json | null;
          cpf?: string | null;
          created_at?: string | null;
          cref?: string | null;
          email?: string | null;
          full_name: string;
          gender?: string | null;
          goal?: string | null;
          height_cm?: number | null;
          id: string;
          last_assessment?: string | null;
          phone?: string | null;
          prebuilt_workout?: Json | null;
          role: string;
          status?: string | null;
          teacher_id?: string | null;
          weight_kg?: number | null;
        };
        Update: {
          avatar_url?: string | null;
          birth_date?: string | null;
          body_fat_percent?: number | null;
          body_measurements?: Json | null;
          cpf?: string | null;
          created_at?: string | null;
          cref?: string | null;
          email?: string | null;
          full_name?: string;
          gender?: string | null;
          goal?: string | null;
          height_cm?: number | null;
          id?: string;
          last_assessment?: string | null;
          phone?: string | null;
          prebuilt_workout?: Json | null;
          role?: string;
          status?: string | null;
          teacher_id?: string | null;
          weight_kg?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "users_teacher_id_fkey";
            columns: ["teacher_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
