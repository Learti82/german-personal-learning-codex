import type { AppSnapshot } from '../store/useAppStore'
import type { DailyTask, GermanLevel, GrammarTopic } from '../types'
import { grammarTopics } from '../data/content'

const goalFocus:Record<string,{skill:DailyTask['skill'];route:string;title:string;subtitle:string}>={
 'Everyday German':{skill:'Sprechen',route:'/speaking',title:'Alltag sprechen',subtitle:'Eine reale Alltagssituation'},
 'Call center':{skill:'Sprechen',route:'/call-center',title:'Kundengespräch',subtitle:'Deeskalation und klare Hilfe'},
 'Reach B1/B2':{skill:'Grammatik',route:'/grammar',title:'Niveau aufbauen',subtitle:'Deine nächste Grammatikstufe'},
 'Goethe/TELC':{skill:'Lesen',route:'/placement',title:'Prüfungsmodus',subtitle:'Lesen, Hören und Schreiben unter Testbedingungen'},
}

export function weakestGrammar(snapshot:Pick<AppSnapshot,'profile'|'grammarMastery'>):GrammarTopic|undefined{
 const levelTopics=grammarTopics.filter(g=>g.level===snapshot.profile.currentLevel)
 return [...levelTopics].sort((a,b)=>(snapshot.grammarMastery.find(m=>m.topicId===a.id)?.score??0)-(snapshot.grammarMastery.find(m=>m.topicId===b.id)?.score??0))[0]
}

export function buildDailyPlan(snapshot:AppSnapshot):DailyTask[]{
 const due=snapshot.reviews.filter(r=>r.nextReview<=Date.now()).length
 const openMistakes=snapshot.mistakes.filter(m=>!m.reviewed).length
 const weak=weakestGrammar(snapshot)
 const focus=goalFocus[snapshot.profile.goal]??goalFocus['Call center']
 const tasks:DailyTask[]=[
  {id:'review',title:'Fjalët për sot',subtitle:`${due||10} fjalë me përsëritje inteligjente`,minutes:5,route:'/flashcards',skill:'Wortschatz',reason:due?'Këto fjalë janë gati për përsëritje.':'Po ndërtojmë zakonin e fjalorit.'},
  {id:'grammar',title:weak?.title??'Grammatik festigen',subtitle:`Mini-Training · ${snapshot.profile.currentLevel}`,minutes:8,route:`/grammar${weak?`?topic=${weak.id}`:''}`,skill:'Grammatik',reason:weak?'Kjo është tema jote më pak e ushtruar.':'Një bazë e fortë e bën të folurin më të sigurt.'},
  openMistakes?{id:'mistakes',title:'Gabimet e tua',subtitle:`${openMistakes} gabime për t’i kthyer në siguri`,minutes:5,route:'/mistakes',skill:'Grammatik',reason:'Ushtrimi i gabimeve të tua ka vlerën më të lartë.'}:{id:'listening',title:'Hörtraining',subtitle:'Një bisedë reale',minutes:5,route:'/listening',skill:'Hören',reason:'Dëgjimi i shkurtër çdo ditë rrit kuptimin.'},
  {id:'focus',title:focus.title,subtitle:focus.subtitle,minutes:10,route:focus.route,skill:focus.skill,reason:`Zgjedhur nga qëllimi yt: ${snapshot.profile.goal}.`},
 ]
 return tasks
}

export function inferTopicId(text:string,level:GermanLevel){
 const n=text.toLowerCase();const topics=grammarTopics.filter(g=>g.level===level)
 const found=topics.find(g=>[g.title,g.rule,g.formula??''].some(value=>value.toLowerCase().split(/\W+/).some(word=>word.length>4&&n.includes(word))))
 return found?.id
}
