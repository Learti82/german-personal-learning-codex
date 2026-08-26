import { grammarTopics, vocabulary } from '../data/content'
import type { CustomMaterial, Exercise, GermanLevel } from '../types'

const stop=new Set('der die das den dem des ein eine einer eines und oder aber ist sind war waren wird werden ich du er sie es wir ihr nicht mit von für auf in im an zu zum zur dass diese dieser dieses auch noch schon sehr sich als bei aus um'.split(' '))

export function analyzeMaterial(title:string,text:string,level:GermanLevel):CustomMaterial{
 const tokens=(text.match(/[A-Za-zÄÖÜäöüß]{4,}/g)??[]).map(w=>w.toLowerCase()).filter(w=>!stop.has(w))
 const counts=new Map<string,number>();tokens.forEach(w=>counts.set(w,(counts.get(w)??0)+1))
 const selected=[...counts].sort((a,b)=>b[1]-a[1]).slice(0,10).map(([token])=>{const known=vocabulary.find(v=>`${v.article??''} ${v.word}`.toLowerCase().includes(token));return{word:known?`${known.article??''} ${known.word}`.trim():token,meaning:known?.translation??'Fjalë e re — kuptoje nga konteksti'}})
 const sentences=text.split(/(?<=[.!?])\s+/).filter(s=>s.trim().length>18)
 const detected=grammarTopics.filter(g=>g.level===level&&[g.title,g.rule,g.formula??''].some(value=>value.toLowerCase().split(/\W+/).some(word=>word.length>4&&text.toLowerCase().includes(word)))).slice(0,3)
 const exercises:Exercise[]=[]
 selected.filter(w=>!w.meaning.startsWith('Fjalë e re')).slice(0,3).forEach((w,i)=>exercises.push({id:`custom-word-${i}-${Date.now()}`,level,type:'translation',prompt:`Çfarë do të thotë në këtë tekst: ${w.word}?`,answer:w.meaning,explanation:'Fjala është marrë drejtpërdrejt nga materiali yt.',skill:'Wortschatz'}))
 sentences.slice(0,2).forEach((sentence,i)=>{const words=sentence.trim().split(/\s+/);const removed=words[Math.min(words.length-1,Math.max(1,Math.floor(words.length/2)))];exercises.push({id:`custom-fill-${i}-${Date.now()}`,level,type:'fill',prompt:sentence.replace(removed,'___'),answer:removed.replace(/[.,!?]/g,''),explanation:'Plotëso fjalën që mungon nga fjalia origjinale.',skill:'Lesen'})})
 detected.forEach((g,i)=>exercises.push({id:`custom-grammar-${i}-${Date.now()}`,level,type:'choice',prompt:`Cila temë gramatikore shfaqet në tekst?`,options:[g.title,'Akkusativ','Perfekt'].filter((x,j,a)=>a.indexOf(x)===j).slice(0,3),answer:g.title,explanation:g.sq,skill:'Grammatik'}))
 return{id:crypto.randomUUID(),title:title.trim()||'Materiali im',sourceText:text.trim(),level,words:selected,exercises,createdAt:Date.now()}
}
