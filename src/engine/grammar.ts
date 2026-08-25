import type { Correction, GermanLevel } from '../types'

type Rule = { pattern: RegExp; replace: string; topic: string; de: string; sq: string; min?: GermanLevel }
const rules: Rule[] = [
 { pattern:/\bIch heute Deutsch lerne\b/i,replace:'Ich lerne heute Deutsch',topic:'Verbposition',de:'Im Hauptsatz steht das Verb an Position 2.',sq:'Në fjalinë kryesore folja qëndron në vendin e dytë.' },
 { pattern:/\bIhre Problem\b/gi,replace:'Ihr Problem',topic:'Artikel',de:'„Problem” ist neutral: das Problem.',sq:'“Problem” është asnjanës: das Problem → Ihr Problem.' },
 { pattern:/\bWas ist Ihre Problem\b/gi,replace:'Was ist Ihr Problem',topic:'Artikel',de:'„Problem” ist neutral.',sq:'“Problem” është asnjanës, prandaj përdoret “Ihr”.' },
 { pattern:/\bich habe (prüfen|machen|arbeiten)\b/gi,replace:(_m:string,v:string)=>`ich habe ${v==='prüfen'?'geprüft':v==='machen'?'gemacht':'gearbeitet'}`,topic:'Perfekt',de:'Im Perfekt brauchen wir das Partizip II.',sq:'Në Perfekt nevojitet pjesorja II.' } as unknown as Rule,
 { pattern:/\bweil ich brauche ([^.?!]+)/gi,replace:'weil ich $1 brauche',topic:'Nebensatz',de:'Nach „weil” steht das Verb am Ende.',sq:'Pas “weil”, folja vendoset në fund.' },
 { pattern:/\bKönnen Sie mir Ihre Kundennummer geben\b/gi,replace:'Könnten Sie mir bitte Ihre Kundennummer nennen',topic:'Höflichkeit',de:'Konjunktiv II und „bitte” klingen professioneller.',sq:'Konjunktiv II dhe “bitte” tingëllojnë më profesionalisht.' },
 { pattern:/\bich bin gestern im Kino gegangen\b/gi,replace:'Ich bin gestern ins Kino gegangen',topic:'Wechselpräposition',de:'Bei Bewegung zu einem Ziel: „ins Kino”.',sq:'Kur tregohet lëvizje drejt një vendi, përdorim “ins Kino”.' },
]

export function normalizeText(text:string) { return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zäöüß0-9 ]/g,'').replace(/\s+/g,' ').trim() }
export function similarity(a:string,b:string) { const aa=new Set(normalizeText(a).split(' ')); const bb=new Set(normalizeText(b).split(' ')); const overlap=[...aa].filter(x=>bb.has(x)).length; return overlap/Math.max(aa.size,bb.size,1) }

export function correctGerman(input:string,_level:GermanLevel):Correction {
 let corrected=input.trim(); const issues:string[]=[]; let explanationDe='Dein Satz ist für diese Übung verständlich.'; let explanationSq='Fjalia jote është e kuptueshme për këtë ushtrim.'
 for (const rule of rules) if (rule.pattern.test(corrected)) { rule.pattern.lastIndex=0; corrected=corrected.replace(rule.pattern,rule.replace); issues.push(rule.topic); explanationDe=rule.de; explanationSq=rule.sq }
 if (corrected && !/[.!?]$/.test(corrected)) corrected += '.'
 if (corrected) corrected=corrected[0].toUpperCase()+corrected.slice(1)
 const grammar=Math.max(55,100-issues.length*22); const words=normalizeText(input).split(' ').length; const vocabulary=Math.min(96,65+words*4); const naturalness=Math.max(60,Math.round((grammar+vocabulary)/2)-3)
 return { original:input,corrected,explanationDe,explanationSq,issues,scores:{grammar,vocabulary,naturalness,overall:Math.round((grammar+vocabulary+naturalness)/3)} }
}

export function validateAnswer(given:string,expected:string) { const exact=normalizeText(given)===normalizeText(expected); return { correct:exact||similarity(given,expected)>.82, score:exact?100:Math.round(similarity(given,expected)*100) } }
