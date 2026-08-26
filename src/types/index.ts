export type GermanLevel = 'A1' | 'A2' | 'B1' | 'B2'
export type Skill = 'Wortschatz' | 'Grammatik' | 'Hören' | 'Sprechen' | 'Lesen' | 'Schreiben'
export type ExerciseType = 'choice' | 'fill' | 'translation' | 'order' | 'article' | 'correction' | 'listening'

export interface Lesson { id: string; level: GermanLevel; module: number; title: string; subtitle: string; duration: number; skill: Skill; completed?: boolean; content: string[]; examples: { de: string; sq: string }[]; goals?: string[]; usefulPhrases?: { de: string; sq: string }[]; coachTip?: string }
export interface GrammarTopic { id: string; level: GermanLevel; title: string; de: string; sq: string; rule: string; examples: { de: string; sq: string }[]; mistake: string; when?: string; formula?: string; tips?: string[] }
export interface VocabularyItem { id: string; word: string; translation: string; article?: 'der'|'die'|'das'; plural?: string; level: GermanLevel; topic: string; example: string; difficulty: 1|2|3; frequency: number }
export interface Exercise { id: string; level: GermanLevel; type: ExerciseType; prompt: string; options?: string[]; answer: string; explanation: string; skill: Skill }
export interface ExerciseResult { exerciseId: string; correct: boolean; answer: string; timestamp: number }
export interface ConversationTurn { speaker: 'coach'|'user'; text: string; correction?: Correction }
export interface Conversation { id: string; title: string; level: GermanLevel; category: string; mood?: string; opening: string; goal: string; intents: Intent[] }
export interface Intent { id: string; keywords: string[]; response: string; hint: string }
export interface Correction { original: string; corrected: string; explanationDe: string; explanationSq: string; issues: string[]; scores: { grammar: number; vocabulary: number; naturalness: number; pronunciation: number; overall: number } }
export interface SpeakingAttempt { id: string; scenarioId: string; transcript: string; correction: Correction; timestamp: number }
export interface Mistake { id: string; original: string; correction: string; topic: string; level: GermanLevel; timestamp: number; reviewed: boolean }
export interface DailyGoal { minutes: number; completedMinutes: number; date: string }
export interface UserProgress { xp: number; streak: number; lessonsCompleted: string[]; exercisesCompleted: number; correctAnswers: number; speakingMinutes: number; grammarScore: number; listeningScore: number; levelProgress: Record<GermanLevel, number>; daily: DailyGoal }
export interface UserProfile { name: string; currentLevel: GermanLevel; targetLevel: GermanLevel; dailyGoal: number; goal: string; weakAreas: string[]; strongAreas: string[]; showTranslations: boolean; speechRate: number; theme: 'light'|'dark'; onboarded: boolean }
export interface ReviewState { wordId: string; status: 'new'|'learning'|'difficult'|'mastered'; nextReview: number; interval: number; correctStreak: number; mistakes: number }
export interface CoachContext { level: GermanLevel; scenario: Conversation; turns: ConversationTurn[] }
export interface CoachResponse { reply: string; correction: Correction; matchedIntent?: string; nextHint: string }
export interface GermanCoachEngine { respond(input: string, context: CoachContext): Promise<CoachResponse>; correct(input: string, level: GermanLevel): Promise<Correction> }
export interface Phrase { id: string; category: string; de: string; sq: string; level: GermanLevel }
export interface ReadingQuestion { prompt: string; options: string[]; answer: string; explanation: string }
export interface ReadingText { id: string; level: GermanLevel; title: string; topic: string; text: string; translation: string; vocabulary: { de: string; sq: string }[]; questions: ReadingQuestion[] }
export interface WritingPrompt { id: string; level: GermanLevel; title: string; situation: string; task: string; checklist: string[]; phrases: { de: string; sq: string }[]; model: string; modelSq: string }
export type MasteryStatus = 'new' | 'learning' | 'strong'
export interface GrammarMastery { topicId: string; attempts: number; correct: number; score: number; status: MasteryStatus; lastPracticed: number }
export interface ExerciseHistory { id: string; exerciseId: string; topicId?: string; skill: Skill; correct: boolean; answer: string; timestamp: number }
export interface PlacementResult { level: GermanLevel; score: number; sectionScores: Record<Skill,number>; completedAt: number }
export interface WritingAttempt { id: string; promptId: string; text: string; correction: Correction; timestamp: number }
export interface CustomMaterial { id: string; title: string; sourceText: string; level: GermanLevel; words: { word: string; meaning: string }[]; exercises: Exercise[]; createdAt: number }
export interface SyncState { status: 'local'|'syncing'|'synced'|'error'; lastSyncedAt?: number; message?: string }
export interface DailyTask { id: string; title: string; subtitle: string; minutes: number; route: string; skill: Skill; reason: string }
