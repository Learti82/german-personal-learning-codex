import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { GermanLevel, Mistake, ReviewState, UserProfile, UserProgress } from '../types'
import { scheduleReview } from '../engine/srs'
import { indexedDBStorage } from './db'

const today=()=>new Date().toISOString().slice(0,10)
const defaultProfile:UserProfile={name:'Leart',currentLevel:'A1',targetLevel:'B2',dailyGoal:30,goal:'Call center',weakAreas:['Grammatik','Sprechen'],strongAreas:['Wortschatz'],showTranslations:true,speechRate:.9,theme:'light',onboarded:false}
const defaultProgress:UserProgress={xp:0,streak:0,lessonsCompleted:[],exercisesCompleted:0,correctAnswers:0,speakingMinutes:0,grammarScore:0,listeningScore:0,levelProgress:{A1:0,A2:0,B1:0,B2:0},daily:{minutes:30,completedMinutes:0,date:today()}}
type State={profile:UserProfile;progress:UserProgress;reviews:ReviewState[];mistakes:Mistake[];savedWords:string[];updateProfile:(p:Partial<UserProfile>)=>void;completeOnboarding:(level:GermanLevel,goal:string,minutes:number)=>void;completeLesson:(id:string,level:GermanLevel)=>void;recordExercise:(correct:boolean)=>void;recordSpeaking:(minutes:number)=>void;reviewWord:(id:string,correct:boolean)=>void;toggleWord:(id:string)=>void;addMistake:(m:Omit<Mistake,'id'|'timestamp'|'reviewed'>)=>void;reset:()=>void;importData:(data:Partial<State>)=>void}
export const useAppStore=create<State>()(persist((set,get)=>({
 profile:defaultProfile,progress:defaultProgress,reviews:[],mistakes:[],savedWords:[],
 updateProfile:p=>set(s=>({profile:{...s.profile,...p}})),
 completeOnboarding:(level,goal,minutes)=>set(s=>({profile:{...s.profile,currentLevel:level,goal,dailyGoal:minutes,onboarded:true},progress:{...s.progress,daily:{...s.progress.daily,minutes}}})),
 completeLesson:(id,level)=>set(s=>{if(s.progress.lessonsCompleted.includes(id))return s;const done=[...s.progress.lessonsCompleted,id];return{progress:{...s.progress,xp:s.progress.xp+25,lessonsCompleted:done,daily:{...s.progress.daily,completedMinutes:s.progress.daily.completedMinutes+10},levelProgress:{...s.progress.levelProgress,[level]:Math.min(100,s.progress.levelProgress[level]+4)}}}}),
 recordExercise:correct=>set(s=>({progress:{...s.progress,xp:s.progress.xp+(correct?10:2),exercisesCompleted:s.progress.exercisesCompleted+1,correctAnswers:s.progress.correctAnswers+(correct?1:0),daily:{...s.progress.daily,completedMinutes:s.progress.daily.completedMinutes+2}}})),
 recordSpeaking:minutes=>set(s=>({progress:{...s.progress,xp:s.progress.xp+Math.round(minutes*8),speakingMinutes:s.progress.speakingMinutes+minutes,daily:{...s.progress.daily,completedMinutes:s.progress.daily.completedMinutes+minutes}}})),
 reviewWord:(id,correct)=>set(s=>{const old=s.reviews.find(r=>r.wordId===id);const next={...scheduleReview(old,correct),wordId:id};return{reviews:[...s.reviews.filter(r=>r.wordId!==id),next],progress:{...s.progress,xp:s.progress.xp+(correct?5:1)}}}),
 toggleWord:id=>set(s=>({savedWords:s.savedWords.includes(id)?s.savedWords.filter(x=>x!==id):[...s.savedWords,id]})),
 addMistake:m=>set(s=>({mistakes:[{...m,id:crypto.randomUUID(),timestamp:Date.now(),reviewed:false},...s.mistakes].slice(0,100)})),
 reset:()=>set({profile:defaultProfile,progress:defaultProgress,reviews:[],mistakes:[],savedWords:[]}),
 importData:data=>set(s=>({profile:data.profile??s.profile,progress:data.progress??s.progress,reviews:data.reviews??s.reviews,mistakes:data.mistakes??s.mistakes,savedWords:data.savedWords??s.savedWords}))
}),{name:'deutschcoach-v1',storage:createJSONStorage(()=>indexedDBStorage)}))
export const exportProgress=()=>{const s=useAppStore.getState();return JSON.stringify({version:1,exportedAt:new Date().toISOString(),profile:s.profile,progress:s.progress,reviews:s.reviews,mistakes:s.mistakes,savedWords:s.savedWords},null,2)}
