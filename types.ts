
export enum ToolType {
  CHAT = 'CHAT',
  IMAGE_GEN = 'IMAGE_GEN',
  VISION = 'VISION',
  SPEECH = 'SPEECH',
  HISTORY = 'HISTORY'
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  groundingUrls?: Array<{ title: string; uri: string }>;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
}

export interface HistoryEntry {
  id: string;
  type: ToolType;
  title: string;
  content: any;
  timestamp: number;
  metadata?: any;
}
