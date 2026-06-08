export interface Profile {
  mbti: string | null;
  role: string | null;
  age: string | null;
  exp: string | null;
  aiFreq: string | null;
  strength: string | null;
}

export type AppStep = 'intro' | 'profile' | 'quiz' | 'result';

export interface AppState {
  step: AppStep;
  answers: Record<number, number>;
  currentQ: number;
  profile: Profile;
  consultingText: string;
}
