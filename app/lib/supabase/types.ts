/* eslint-disable @typescript-eslint/no-empty-object-type */
// lib/supabase/types.ts

/** Tipo JSON genérico usado por Supabase */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

/** Esquema minimalista de la base de datos para Supabase */
export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          category: string | null
          image_url: string | null
          video_url: string | null // ← AGREGADO
          published: boolean
          author_id: string | null
          created_at: string // timestamp
          updated_at: string | null // timestamp
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content: string
          category?: string | null
          image_url?: string | null
          video_url?: string | null // ← AGREGADO
          published?: boolean
          author_id?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string
          category?: string | null
          image_url?: string | null
          video_url?: string | null // ← AGREGADO
          published?: boolean
          author_id?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }

      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'admin' | 'editor' | 'user' | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'editor' | 'user' | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'editor' | 'user' | null
          created_at?: string
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}