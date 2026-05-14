export type SignalType = "foresight" | "article" | "social" | "technology";

export type SignalStrength = "weak" | "medium" | "strong";

export interface Tag {
  id: string;
  name: string;
  color: string;
  category: "sector" | "theme" | "horizon" | "technology" | "custom";
}

export interface Comment {
  id: string;
  signalId: string;
  authorName: string;
  authorInitials: string;
  content: string;
  createdAt: string;
}

export interface Signal {
  id: string;
  title: string;
  description: string;
  url?: string;
  source?: string;
  type: SignalType;
  strength: SignalStrength;
  tags: Tag[];
  votes: number;
  userVoted: boolean;
  comments: Comment[];
  authorName: string;
  authorInitials: string;
  createdAt: string;
  updatedAt: string;
}
