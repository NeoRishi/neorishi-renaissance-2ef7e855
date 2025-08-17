export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
        Relationships: [
          {
            foreignKeyName: "challenges_questionnaire_id_fkey"
            columns: ["questionnaire_id"]
            isOneToOne: false
            referencedRelation: "goals_questionnaire"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "food_preferences_questionnaire_id_fkey"
            columns: ["questionnaire_id"]
            isOneToOne: false
            referencedRelation: "goals_questionnaire"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "goals_questionnaire_id_fkey"
            columns: ["questionnaire_id"]
            isOneToOne: false
            referencedRelation: "goals_questionnaire"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "goals_questionnaire_assessment_result_id_fkey"
            columns: ["assessment_result_id"]
            isOneToOne: false
            referencedRelation: "assessment_results"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone_number: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone_number?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone_number?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      wellness_profiles: {
        Row: {
          age: number | null
          city: string | null
          country: string | null
          created_at: string | null
          gender: string | null
          height: number | null
          id: string
          preferred_name: string | null
          user_id: string | null
          weight: number | null
          zip: string | null
        }
        Insert: {
          age?: number | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          gender?: string | null
          height?: number | null
          id?: string
          preferred_name?: string | null
          user_id?: string | null
          weight?: number | null
          zip?: string | null
        }
        Update: {
          age?: number | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          gender?: string | null
          height?: number | null
          id?: string
          preferred_name?: string | null
          user_id?: string | null
          weight?: number | null
          zip?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
