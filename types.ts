export enum GameType {
  MEMORY = 'MEMORY',
  FOCUS = 'FOCUS',
  MATH = 'MATH',
  LOGIC = 'LOGIC'
}

export enum ScreenState {
  DASHBOARD = 'DASHBOARD',
  PLAYING = 'PLAYING',
  ANALYSIS = 'ANALYSIS',
  AICOACH = 'AICOACH'
}

export interface GameResult {
  gameType: GameType;
  score: number;
  maxScore?: number; // For memory levels
  date: string;
}

export interface UserStats {
  streak: number;
  totalGames: number;
  history: GameResult[];
  categoryScores: {
    [key in GameType]: number; // 0-100 normalized score
  };
}

export interface AnalysisData {
  summary: string;
  tip: string;
  strength: string;
  weakness: string;
}