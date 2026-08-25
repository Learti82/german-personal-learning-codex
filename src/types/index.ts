export type GermanLevel = 'A1' | 'A2' | 'B1' | 'B2'
export type Skill = 'Wortschatz' | 'Grammatik' | 'Hören' | 'Sprechen' | 'Lesen' | 'Schreiben'
export type ExerciseType = 'choice' | 'fill' | 'translation' | 'order' | 'article' | 'correction' | 'listening'

export interface Lesson { id: string; level: GermanLevel; module: number; title: string; subtitle: string; duration: number; skill: Skill; completed?: boolean; content: string[]; examples: { de: string; sq: string }[] }
export interface GrammarTopic { id: string; level: GermanLevel; title: string; de: string; sq: string; rule: string; examples: { de: string; sq: string }[]; mistake: string }
export interface VocabularyItem { id: string; word: string; translation: string; article?: 'der'|'die'|'das'; plural?: string; level: GermanLevel; topic: string; example: string; difficulty: 1|2|3; frequency: number }
export interface Exercise { id: string; level: GermanLevel; type: ExerciseType; prompt: string; options?: string[]; answer: string; explanation: string; skill: Skill }
export interface ExerciseResult { exerciseId: string; correct: boolean; answer: string; timestamp: number }
export interface ConversationTurn { speaker: 'coach'|'user'; text: string; correction?: Correction }
export interface Conversation { id: string; title: string; level: GermanLevel; category: string; mood?: string; opening: string; goal: string; intents: Intent[] }
export interface Intent { id: string; keywords: string[]; response: string; hint: string }
export interface Correction { original: string; corrected: string; explanationDe: string; explanationSq: string; issues: string[]; scores: { grammar: number; vocabulary: number; naturalness: number; overall: number } }
export interface SpeakingAttempt { id: string; scenarioId: string; transcript: string; correction: Correction; timestamp: number }
export interface Mistake { id: string; original: string; correction: string; topic: string; level: GermanLevel; timestamp: number; reviewed: boolean }
export interface DailyGoal { minutes: number; completedMinutes: number; date: string }
export interface UserProgress { xp: number; streak: number; lessonsCompleted: string[]; exercisesCompleted: number; correctAnswers: number; speakingMinutes: number; grammarScore: number; listeningScore: number; levelProgress: Record<GermanLevel, number>; daily: DailyGoal }
export interface UserProfile { name: string; currentLevel: GermanLevel; targetLevel: GermanLevel; dailyGoal: number; goal: string; weakAreas: string[]; strongAreas: string[]; showTranslations: boolean; speechRate: number; theme: 'light'|'dark'; onboarded: boolean }
export interface ReviewState { wordId: string; status: 'new'|'learning'|'difficult'|'mastered'; nextReview: number; interval: number; correctStreak: number; mistakes: number }
export interface CoachContext { level: GermanLevel; scenario: Conversation; turns: ConversationTurn[] }
export interface CoachResponse { reply: string; correction: Correction; matchedIntent?: string; nextHint: string }
export interface GermanCoachEngine { respond(input: string, context: CoachContext): Promise<CoachResponse>; correct(input: string, level: GermanLevel): Promise<Correction> }
