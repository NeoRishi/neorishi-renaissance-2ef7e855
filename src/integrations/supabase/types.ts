export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      assessment_results: {
        Row: {
          answers: Json
          constitution_type: string
          created_at: string
          dominant_dosha: string
          id: string
          scores: Json
          total_questions: number
          updated_at: string
          user_id: string
        }
        Insert: {
          answers: Json
          constitution_type: string
          created_at?: string
          dominant_dosha: string
          id?: string
          scores: Json
          total_questions: number
          updated_at?: string
          user_id: string
        }
        Update: {
          answers?: Json
          constitution_type?: string
          created_at?: string
          dominant_dosha?: string
          id?: string
          scores?: Json
          total_questions?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      challenges: {
        Row: {
          challenge_id: string
          created_at: string
          id: string
          questionnaire_id: string
        }
        Insert: {
          challenge_id: string
          created_at?: string
          id?: string
          questionnaire_id: string
        }
        Update: {
          challenge_id?: string
          created_at?: string
          id?: string
          questionnaire_id?: string
        }
        Relationships: []
      }
      daily_tasks: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          description: string | null
          id: string
          task_date: string
          task_type: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          task_date: string
          task_type: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          task_date?: string
          task_type?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      food_preferences: {
        Row: {
          created_at: string
          id: string
          preference_id: string
          questionnaire_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          preference_id: string
          questionnaire_id: string
        }
        Update: {
          created_at?: string
          id?: string
          preference_id?: string
          questionnaire_id?: string
        }
        Relationships: []
      }
      goals: {
        Row: {
          created_at: string
          goal_id: string
          id: string
          questionnaire_id: string
        }
        Insert: {
          created_at?: string
          goal_id: string
          id?: string
          questionnaire_id: string
        }
        Update: {
          created_at?: string
          goal_id?: string
          id?: string
          questionnaire_id?: string
        }
        Relationships: []
      }
      goals_questionnaire: {
        Row: {
          activity_level: string
          assessment_result_id: string
          created_at: string
          energy_level: number
          id: string
          sleep_quality: number
          stress_level: number
          time_available: number
          updated_at: string
          user_id: string
        }
        Insert: {
          activity_level: string
          assessment_result_id: string
          created_at?: string
          energy_level: number
          id?: string
          sleep_quality: number
          stress_level: number
          time_available: number
          updated_at?: string
          user_id: string
        }
        Update: {
          activity_level?: string
          assessment_result_id?: string
          created_at?: string
          energy_level?: number
          id?: string
          sleep_quality?: number
          stress_level?: number
          time_available?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          created_at: string
          entry_date: string
          id: string
          improvements: string | null
          reflection: string | null
          sankalpa: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          entry_date: string
          id?: string
          improvements?: string | null
          reflection?: string | null
          sankalpa?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          entry_date?: string
          id?: string
          improvements?: string | null
          reflection?: string | null
          sankalpa?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      onboarding_responses: {
        Row: {
          birth_place: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          email_verification_expires_at: string | null
          email_verification_token: string | null
          full_name: string | null
          id: string
          is_email_verified: boolean
          is_phone_verified: boolean
          phone: string | null
          phone_verification_expires_at: string | null
          phone_verification_token: string | null
          responses: Json
          time_of_birth: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          birth_place?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          email_verification_expires_at?: string | null
          email_verification_token?: string | null
          full_name?: string | null
          id?: string
          is_email_verified?: boolean
          is_phone_verified?: boolean
          phone?: string | null
          phone_verification_expires_at?: string | null
          phone_verification_token?: string | null
          responses: Json
          time_of_birth?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          birth_place?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          email_verification_expires_at?: string | null
          email_verification_token?: string | null
          full_name?: string | null
          id?: string
          is_email_verified?: boolean
          is_phone_verified?: boolean
          phone?: string | null
          phone_verification_expires_at?: string | null
          phone_verification_token?: string | null
          responses?: Json
          time_of_birth?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      panchanga_cache: {
        Row: {
          cache_date: string
          created_at: string
          id: string
          panchanga_data: Json
          updated_at: string
        }
        Insert: {
          cache_date: string
          created_at?: string
          id?: string
          panchanga_data: Json
          updated_at?: string
        }
        Update: {
          cache_date?: string
          created_at?: string
          id?: string
          panchanga_data?: Json
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          birth_place: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          full_name: string | null
          id: string
          is_email_verified: boolean
          is_phone_verified: boolean
          phone: string | null
          time_of_birth: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          birth_place?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_email_verified?: boolean
          is_phone_verified?: boolean
          phone?: string | null
          time_of_birth?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          birth_place?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_email_verified?: boolean
          is_phone_verified?: boolean
          phone?: string | null
          time_of_birth?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      streaks: {
        Row: {
          created_at: string
          current_count: number
          id: string
          last_activity_date: string | null
          longest_count: number
          streak_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_count?: number
          id?: string
          last_activity_date?: string | null
          longest_count?: number
          streak_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_count?: number
          id?: string
          last_activity_date?: string | null
          longest_count?: number
          streak_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      safe_onboarding_responses: {
        Row: {
          birth_place: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string | null
          full_name: string | null
          id: string | null
          is_email_verified: boolean | null
          is_phone_verified: boolean | null
          phone: string | null
          responses: Json | null
          time_of_birth: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          birth_place?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          full_name?: string | null
          id?: string | null
          is_email_verified?: boolean | null
          is_phone_verified?: boolean | null
          phone?: string | null
          responses?: Json | null
          time_of_birth?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          birth_place?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          full_name?: string | null
          id?: string | null
          is_email_verified?: boolean | null
          is_phone_verified?: boolean | null
          phone?: string | null
          responses?: Json | null
          time_of_birth?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      safe_profiles: {
        Row: {
          birth_place: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string | null
          full_name: string | null
          id: string | null
          is_email_verified: boolean | null
          is_phone_verified: boolean | null
          phone: string | null
          time_of_birth: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          birth_place?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          full_name?: string | null
          id?: string | null
          is_email_verified?: boolean | null
          is_phone_verified?: boolean | null
          phone?: string | null
          time_of_birth?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          birth_place?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          full_name?: string | null
          id?: string | null
          is_email_verified?: boolean | null
          is_phone_verified?: boolean | null
          phone?: string | null
          time_of_birth?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      is_authenticated_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      validate_user_data_access: {
        Args: { target_user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
