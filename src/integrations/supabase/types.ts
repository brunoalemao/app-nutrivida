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
      ai_content_history: {
        Row: {
          id: string
          user_id: string
          prompt: string
          response: string
          type: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          prompt: string
          response: string
          type: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          prompt?: string
          response?: string
          type?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_content_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      diets: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          total_calories: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          total_calories: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          total_calories?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "diets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      foods: {
        Row: {
          amount: string
          calories: number
          carbs: number
          created_at: string | null
          fat: number
          id: string
          meal_id: string
          name: string
          protein: number
        }
        Insert: {
          amount: string
          calories: number
          carbs: number
          created_at?: string | null
          fat: number
          id?: string
          meal_id: string
          name: string
          protein: number
        }
        Update: {
          amount?: string
          calories?: number
          carbs?: number
          created_at?: string | null
          fat?: number
          id?: string
          meal_id?: string
          name?: string
          protein?: number
        }
        Relationships: [
          {
            foreignKeyName: "foods_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
        ]
      }
      meals: {
        Row: {
          calories: number
          created_at: string | null
          diet_id: string
          id: string
          meal_type: string
          name: string
        }
        Insert: {
          calories: number
          created_at?: string | null
          diet_id: string
          id?: string
          meal_type: string
          name: string
        }
        Update: {
          calories?: number
          created_at?: string | null
          diet_id?: string
          id?: string
          meal_type?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "meals_diet_id_fkey"
            columns: ["diet_id"]
            isOneToOne: false
            referencedRelation: "diets"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          name: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      recipes: {
        Row: {
          calories: number
          cook_time: number
          created_at: string | null
          description: string | null
          id: string
          image: string | null
          ingredients: string[]
          instructions: string[]
          name: string
          prep_time: number
          servings: number
          tags: string[] | null
        }
        Insert: {
          calories: number
          cook_time: number
          created_at?: string | null
          description?: string | null
          id?: string
          image?: string | null
          ingredients: string[]
          instructions: string[]
          name: string
          prep_time: number
          servings: number
          tags?: string[] | null
        }
        Update: {
          calories?: number
          cook_time?: number
          created_at?: string | null
          description?: string | null
          id?: string
          image?: string | null
          ingredients?: string[]
          instructions?: string[]
          name?: string
          prep_time?: number
          servings?: number
          tags?: string[] | null
        }
        Relationships: []
      }
      user_metrics: {
        Row: {
          bmi: number
          bmr: number
          created_at: string | null
          daily_calories: number
          id: string
          updated_at: string | null
          user_id: string
          weekly_goal: number
        }
        Insert: {
          bmi: number
          bmr: number
          created_at?: string | null
          daily_calories: number
          id?: string
          updated_at?: string | null
          user_id: string
          weekly_goal: number
        }
        Update: {
          bmi?: number
          bmr?: number
          created_at?: string | null
          daily_calories?: number
          id?: string
          updated_at?: string | null
          user_id?: string
          weekly_goal?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_metrics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          activity_level: string
          age: number
          created_at: string | null
          current_weight: number
          gender: string
          goal_weight: number
          height: number
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          activity_level: string
          age: number
          created_at?: string | null
          current_weight: number
          gender: string
          goal_weight: number
          height: number
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          activity_level?: string
          age?: number
          created_at?: string | null
          current_weight?: number
          gender?: string
          goal_weight?: number
          height?: number
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      weight_history: {
        Row: {
          id: string
          recorded_at: string | null
          user_id: string
          weight: number
        }
        Insert: {
          id?: string
          recorded_at?: string | null
          user_id: string
          weight: number
        }
        Update: {
          id?: string
          recorded_at?: string | null
          user_id?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "weight_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
