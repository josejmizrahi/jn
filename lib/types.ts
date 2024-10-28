export type PostType = 
  | "text" 
  | "multimedia" 
  | "event" 
  | "education" 
  | "fundraising" 
  | "governance" 
  | "poll" 
  | "marketplace" 
  | "livestream" 
  | "collaboration";

export interface PostFormData {
  type: PostType;
  title: string;
  content: string;
  category: string;
  metadata: Record<string, any>;
}