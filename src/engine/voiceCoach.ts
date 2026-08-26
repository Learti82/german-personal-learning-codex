import type { GermanLevel } from '../types'
import { normalizeText } from './grammar'

export type CoachMood='idle'|'listening'|'thinking'|'speaking'
const connectors=['weil','aber','deshalb','dann','obwohl','wenn','dass','trotzdem','zuerst','danach']
const hesitations=['äh','ähm','hm','also']

export function analyzeFluency(text:string,confidence?:number){
 const words=text.trim().split(/\s+/).filter(Boolean);const normalized=normalizeText(text)
 const links=connectors.filter(word=>normalized.split(' ').includes(word)).length
 const pauses=hesitations.reduce((sum,word)=>sum+(normalized.match(new RegExp(`\\b${word}\\b`,'g'))?.length??0),0)
 const repeated=words.slice(1).filter((word,index)=>normalizeText(word)===normalizeText(words[index])).length
 const fluency=Math.max(25,Math.min(100,34+words.length*3+links*8-pauses*5-repeated*7))
 const pronunciation=confidence===undefined?null:Math.max(35,Math.min(100,Math.round(confidence*100)))
 return{words:words.length,connectors:links,hesitations:pauses,fluency,pronunciation}
}

const acknowledgements:Record<GermanLevel,string[]>={A1:['Sehr gut, ich habe dich verstanden.','Gut gemacht!','Prima, wir sprechen weiter.'],A2:['Das hast du klar erklärt.','Sehr schön, ich verstehe dich.','Gut reagiert.'],B1:['Das klingt schon sehr natürlich.','Gute Erklärung — bleiben wir im Gespräch.','Ich verstehe deinen Standpunkt.'],B2:['Das war überzeugend und gut strukturiert.','Sehr professionell formuliert.','Deine Antwort wirkt sicher und differenziert.']}
const followUps:Record<GermanLevel,string[]>={A1:['Was machst du danach?','Kannst du noch einen Satz sagen?','Warum ist das wichtig für dich?'],A2:['Wie würdest du das genauer erklären?','Was wäre für dich eine gute Lösung?','Kannst du mir ein Beispiel geben?'],B1:['Welche Alternative würdest du vorschlagen?','Wie würdest du reagieren, wenn das nicht funktioniert?','Was ist dabei deiner Meinung nach besonders wichtig?'],B2:['Welche Vor- und Nachteile siehst du dabei?','Wie würdest du deine Position höflich, aber bestimmt vertreten?','Welche langfristige Lösung würdest du empfehlen?']}
const rescue:Record<GermanLevel,string[]>={A1:['Ich denke, dass …','Für mich ist … wichtig.','Danach möchte ich …'],A2:['Meiner Meinung nach …','Ich würde vorschlagen, dass …','Ein gutes Beispiel dafür ist …'],B1:['Ich kann gut nachvollziehen, dass …','Eine mögliche Lösung wäre …','Einerseits …, andererseits …'],B2:['Unter diesen Umständen würde ich …','Entscheidend ist aus meiner Sicht, dass …','Zusammenfassend lässt sich sagen, dass …']}

export function localFollowUp(input:string,level:GermanLevel,turn:number){const analysis=analyzeFluency(input);const acknowledge=acknowledgements[level][turn%acknowledgements[level].length];const question=followUps[level][(turn+analysis.connectors)%followUps[level].length];const prefix=analysis.words<5?(level==='A1'?'Versuche einen ganzen Satz. ':'Mach deine Antwort etwas länger. '):'';return`${acknowledge} ${prefix}${question}`}
export function rescuePhrases(level:GermanLevel){return rescue[level]}
export function speakGermanAsync(text:string,rate=.9,voiceName?:string,onState?:(m:CoachMood)=>void){return new Promise<boolean>(resolve=>{if(typeof window==='undefined'||!('speechSynthesis' in window)){resolve(false);return}window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='de-DE';u.rate=rate;const voices=window.speechSynthesis.getVoices();u.voice=voices.find(v=>v.name===voiceName)||voices.find(v=>v.lang.startsWith('de'))||null;u.onstart=()=>onState?.('speaking');u.onend=()=>{onState?.('idle');resolve(true)};u.onerror=()=>{onState?.('idle');resolve(false)};window.speechSynthesis.speak(u)})}
