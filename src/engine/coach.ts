import type { CoachContext, CoachResponse, GermanCoachEngine, GermanLevel } from '../types'
import { correctGerman, normalizeText } from './grammar'

export class LocalCoachEngine implements GermanCoachEngine {
 async correct(input:string,level:GermanLevel) { return correctGerman(input,level) }
 async respond(input:string,context:CoachContext):Promise<CoachResponse> {
  const correction=correctGerman(input,context.level); const normalized=normalizeText(input)
  const used=context.turns.filter(t=>t.speaker==='user').length
  const available=context.scenario.intents.filter((_,i)=>i>=Math.max(0,used-1))
  const matched=available.find(intent=>intent.keywords.some(k=>normalized.includes(normalizeText(k)))) ?? context.scenario.intents.find(intent=>intent.keywords.some(k=>normalized.includes(normalizeText(k))))
  const fallback=context.level==='A1'?'Gut! Bitte antworte mit einem ganzen Satz.':context.level==='A2'?'Danke. Kannst du das bitte etwas genauer erklären?':'Ich verstehe. Wie würden Sie jetzt professionell weiter vorgehen?'
  const nextIndex=matched?Math.min(context.scenario.intents.length-1,context.scenario.intents.indexOf(matched)+1):Math.min(used,context.scenario.intents.length-1)
  return {reply:matched?.response??fallback,correction,matchedIntent:matched?.id,nextHint:context.scenario.intents[nextIndex]?.hint??'Fasse die Lösung höflich zusammen.'}
 }
}
export const coachService:{engine:GermanCoachEngine}={engine:new LocalCoachEngine()}
export function speakGerman(text:string,rate=0.9,voiceName?:string) {
 if (!('speechSynthesis' in window)) return false
 window.speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text); u.lang='de-DE'; u.rate=rate
 const voices=window.speechSynthesis.getVoices(); u.voice=voices.find(v=>v.name===voiceName)||voices.find(v=>v.lang.startsWith('de'))||null; window.speechSynthesis.speak(u); return true
}
