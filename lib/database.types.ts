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
      feed_items: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          author_id: string
          type: 'post' | 'event' | 'product' | 'class' | 'fundraising' | 'proposal'
          title: string
          description: string
          media_urls: string[]
          metadata: Json
          status: 'active' | 'archived' | 'deleted'
          visibility: 'public' | 'members' | 'private'
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          author_id: string
          type: 'post' | 'event' | 'product' | 'class' | 'fundraising' | 'proposal'
          title: string
          description: string
          media_urls?: string[]
          metadata?: Json
          status?: 'active' | 'archived' | 'deleted'
          visibility?: 'public' | 'members' | 'private'
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          author_id?: string
          type?: 'post' | 'event' | 'product' | 'class' | 'fundraising' | 'proposal'
          title?: string
          description?: string
          media_urls?: string[]
          metadata?: Json
          status?: 'active' | 'archived' | 'deleted'
          visibility?: 'public' | 'members' | 'private'
        }
      }
      comments: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          feed_item_id: string
          author_id: string
          content: string
          parent_id: string | null
          status: 'active' | 'deleted'
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          feed_item_id: string
          author_id: string
          content: string
          parent_id?: string | null
          status?: 'active' | 'deleted'
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          feed_item_id?: string
          author_id?: string
          content?: string
          parent_id?: string | null
          status?: 'active' | 'deleted'
        }
      }
      engagements: {
        Row: {
          id: string
          created_at: string
          user_id: string
          feed_item_id: string
          type: 'like' | 'bookmark' | 'share'
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          feed_item_id: string
          type: 'like' | 'bookmark' | 'share'
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          feed_item_id?: string
          type?: 'like' | 'bookmark' | 'share'
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          created_at?: string
        }
      }
      feed_items_tags: {
        Row: {
          feed_item_id: string
          tag_id: string
          created_at: string
        }
        Insert: {
          feed_item_id: string
          tag_id: string
          created_at?: string
        }
        Update: {
          feed_item_id?: string
          tag_id?: string
          created_at?: string
        }
      }
      reports: {
        Row: {
          id: string
          created_at: string
          reporter_id: string
          feed_item_id: string | null
          comment_id: string | null
          reason: string
          status: 'pending' | 'resolved' | 'dismissed'
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          reporter_id: string
          feed_item_id?: string | null
          comment_id?: string | null
          reason: string
          status?: 'pending' | 'resolved' | 'dismissed'
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          reporter_id?: string
          feed_item_id?: string | null
          comment_id?: string | null
          reason?: string
          status?: 'pending' | 'resolved' | 'dismissed'
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_feed_item_engagement: {
        Args: {
          item_id: string
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}