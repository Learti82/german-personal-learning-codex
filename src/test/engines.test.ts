import { describe, expect, it } from 'vitest'
import { correctGerman, normalizeText, similarity, validateAnswer } from '../engine/grammar'
import { dueForReview, scheduleReview } from '../engine/srs'
import { LocalCoachEngine } from '../engine/coach'
import { conversations, exercises, grammarTopics, phrases, readingTexts, vocabulary, writingPrompts } from '../data/content'
import { analyzeMaterial } from '../engine/importer'
import { buildDailyPlan } from '../engine/personalization'
import type { AppSnapshot } from '../store/useAppStore'
import { analyzeFluency, localFollowUp, rescuePhrases } from '../engine/voiceCoach'

describe('grammar engine',()=>{
 it('corrects verb position',()=>{const result=correctGerman('Ich heute Deutsch lerne','A1');expect(result.corrected).toBe('Ich lerne heute Deutsch.');expect(result.issues).toContain('Verbposition')})
 it('corrects neutral possessive article',()=>expect(correctGerman('Was ist Ihre Problem','A1').corrected).toBe('Was ist Ihr Problem.'))
 it('normalizes punctuation and accents',()=>expect(normalizeText('  Könnten Sie? ')).toBe('konnten sie'))
})
describe('exercise scoring',()=>{
 it('accepts punctuation variation',()=>expect(validateAnswer('Vielen Dank für Ihre Geduld','Vielen Dank für Ihre Geduld.').correct).toBe(true))
 it('finds close word overlap',()=>expect(similarity('Ich helfe Ihnen gerne weiter','Ich helfe Ihnen weiter')).toBeGreaterThan(.7))
})
describe('spaced repetition',()=>{
 it('increases interval on success',()=>{const first=scheduleReview(undefined,true,0);const second=scheduleReview(first,true,0);expect(first.interval).toBe(1);expect(second.interval).toBe(3)})
 it('marks mistakes difficult and due items',()=>{const failed=scheduleReview(undefined,false,0);expect(failed.status).toBe('difficult');expect(dueForReview([failed],86400000)).toHaveLength(1)})
})
describe('local coach',()=>{
 it('detects customer number intent',async()=>{const scenario=conversations.find(c=>c.id==='billing')!;const result=await new LocalCoachEngine().respond('Könnten Sie mir bitte Ihre Kundennummer nennen?',{level:'B1',scenario,turns:[]});expect(result.matchedIntent).toBe('customer_number');expect(result.reply).toContain('847291')})
})
describe('free voice character',()=>{
 it('rewards longer connected speech',()=>{expect(analyzeFluency('Ich möchte eine Lösung, weil die Rechnung falsch ist und deshalb brauche ich Ihre Hilfe.').fluency).toBeGreaterThan(analyzeFluency('Rechnung falsch.').fluency)})
 it('always provides an adaptive question and rescue phrases',()=>{expect(localFollowUp('Ich brauche Hilfe','A2',2)).toContain('?');expect(rescuePhrases('B1')).toHaveLength(3)})
})
describe('content',()=>{
 it('has useful local vocabulary for every CEFR level',()=>{for(const level of ['A1','A2','B1','B2'])expect(vocabulary.filter(v=>v.level===level).length).toBeGreaterThan(50)})
 it('has a rich grammar and exercise path at every level',()=>{for(const level of ['A1','A2','B1','B2']){expect(grammarTopics.filter(g=>g.level===level).length).toBeGreaterThanOrEqual(7);expect(exercises.filter(e=>e.level===level).length).toBeGreaterThanOrEqual(12)}})
 it('includes backup explanations and all four skills levels',()=>{expect(phrases.filter(p=>p.sq).length).toBeGreaterThan(30);expect(readingTexts.map(x=>x.level)).toEqual(['A1','A2','B1','B2']);expect(writingPrompts.map(x=>x.level)).toEqual(['A1','A2','B1','B2'])})
})
describe('personal coach',()=>{
 const snapshot:AppSnapshot={profile:{name:'Leart',currentLevel:'B1',targetLevel:'B2',dailyGoal:30,goal:'Call center',weakAreas:[],strongAreas:[],showTranslations:true,speechRate:.9,theme:'light',onboarded:true},progress:{xp:0,streak:0,lessonsCompleted:[],exercisesCompleted:0,correctAnswers:0,speakingMinutes:0,grammarScore:0,listeningScore:0,levelProgress:{A1:0,A2:0,B1:0,B2:0},daily:{minutes:30,completedMinutes:0,date:'2026-08-26'}},reviews:[],mistakes:[{id:'m1',original:'weil ich brauche Hilfe',correction:'weil ich Hilfe brauche',topic:'Nebensatz',level:'B1',timestamp:1,reviewed:false}],savedWords:[],grammarMastery:[],exerciseHistory:[],writingAttempts:[],customMaterials:[]}
 it('builds an adaptive plan with mistake and goal practice',()=>{const plan=buildDailyPlan(snapshot);expect(plan).toHaveLength(4);expect(plan.some(x=>x.route==='/mistakes')).toBe(true);expect(plan.some(x=>x.route==='/voice-coach')).toBe(true)})
 it('turns a personal text into vocabulary and exercises',()=>{const material=analyzeMaterial('Arbeit','Ich arbeite im Kundenservice. Die Kundin hat eine Frage zur Rechnung. Ich überprüfe den Vorgang und gebe morgen eine Rückmeldung.','B1');expect(material.words.length).toBeGreaterThan(3);expect(material.exercises.length).toBeGreaterThan(2)})
})
