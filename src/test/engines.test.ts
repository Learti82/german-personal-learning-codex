import { describe, expect, it } from 'vitest'
import { correctGerman, normalizeText, similarity, validateAnswer } from '../engine/grammar'
import { dueForReview, scheduleReview } from '../engine/srs'
import { LocalCoachEngine } from '../engine/coach'
import { conversations, exercises, grammarTopics, phrases, readingTexts, vocabulary, writingPrompts } from '../data/content'

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
describe('content',()=>{
 it('has useful local vocabulary for every CEFR level',()=>{for(const level of ['A1','A2','B1','B2'])expect(vocabulary.filter(v=>v.level===level).length).toBeGreaterThan(50)})
 it('has a rich grammar and exercise path at every level',()=>{for(const level of ['A1','A2','B1','B2']){expect(grammarTopics.filter(g=>g.level===level).length).toBeGreaterThanOrEqual(7);expect(exercises.filter(e=>e.level===level).length).toBeGreaterThanOrEqual(12)}})
 it('includes backup explanations and all four skills levels',()=>{expect(phrases.filter(p=>p.sq).length).toBeGreaterThan(30);expect(readingTexts.map(x=>x.level)).toEqual(['A1','A2','B1','B2']);expect(writingPrompts.map(x=>x.level)).toEqual(['A1','A2','B1','B2'])})
})
