export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url: string
          phone_number: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string
          full_name?: string
          avatar_url?: string
          phone_number?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string
          phone_number?: string
          created_at?: string
          updated_at?: string
        }
      }
      assessment_results: {
        Row: {
          id: string
          user_id: string
          dominant_dosha: string
          constitution_type: string
          scores: Json
          answers: Json
          total_questions: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          dominant_dosha: string
          constitution_type: string
          scores: Json
          answers: Json
          total_questions: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          dominant_dosha?: string
          constitution_type?: string
          scores?: Json
          answers?: Json
          total_questions?: number
          created_at?: string
          updated_at?: string
        }
      }
      goals_questionnaire: {
        Row: {
          id: string
          user_id: string
          assessment_result_id: string
          activity_level: string
          time_available: number
          stress_level: number
          sleep_quality: number
          energy_level: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          assessment_result_id: string
          activity_level: string
          time_available: number
          stress_level: number
          sleep_quality: number
          energy_level: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          assessment_result_id?: string
          activity_level?: string
          time_available?: number
          stress_level?: number
          sleep_quality?: number
          energy_level?: number
          created_at?: string
          updated_at?: string
        }
      }
      goals: {
        Row: {
          id: string
          questionnaire_id: string
          goal_id: string
          created_at: string
        }
        Insert: {
          id?: string
          questionnaire_id: string
          goal_id: string
          created_at?: string
        }
        Update: {
          id?: string
          questionnaire_id?: string
          goal_id?: string
          created_at?: string
        }
      }
      food_preferences: {
        Row: {
          id: string
          questionnaire_id: string
          preference_id: string
          created_at: string
        }
        Insert: {
          id?: string
          questionnaire_id: string
          preference_id: string
          created_at?: string
        }
        Update: {
          id?: string
          questionnaire_id?: string
          preference_id?: string
          created_at?: string
        }
      }
      challenges: {
        Row: {
          id: string
          questionnaire_id: string
          challenge_id: string
          created_at: string
        }
        Insert: {
          id?: string
          questionnaire_id: string
          challenge_id: string
          created_at?: string
        }
        Update: {
          id?: string
          questionnaire_id?: string
          challenge_id?: string
          created_at?: string
        }
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
  }
} 