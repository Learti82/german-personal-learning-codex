import { CircleHelp, Lightbulb, X } from 'lucide-react'
import { useState } from 'react'

const helpByArea = {
  course:{title:'Si ta përdorësh kursin',de:'Verstehen → Beispiel → selbst sprechen.',sq:'Kupto idenë, dëgjo shembullin dhe pastaj krijo një fjali tënden.'},
  practice:{title:'Si funksionojnë ushtrimet',de:'Lies den ganzen Satz, finde das Signalwort und prüfe erst dann die Form.',sq:'Lexo gjithë fjalinë, gjej fjalën sinjal dhe pastaj zgjidh formën. Shpjegimi shfaqet pas përgjigjes.'},
  words:{title:'Si t’i mbash mend fjalët',de:'Lerne Nomen immer mit Artikel und einem Beispielsatz.',sq:'Emrat mësoji gjithmonë me artikull dhe me një fjali. Përdor “E vështirë” që të dalin më shpesh.'},
  grammar:{title:'Si ta kuptosh gramatikën',de:'Wann? → Formel → Beispiele → typischer Fehler.',sq:'Shiko kur përdoret, formulën, shembujt dhe gabimin tipik. Pastaj ndrysho një pjesë të shembullit.'},
  listening:{title:'Strategji dëgjimi',de:'Erst normal hören, dann die Frage lesen, zuletzt langsamer wiederholen.',sq:'Së pari dëgjo normalisht, pastaj lexo pyetjen dhe në fund dëgjo më ngadalë.'},
  speaking:{title:'Kur nuk di çfarë të thuash',de:'Nutze den Hinweis und antworte mit einem vollständigen Satz.',sq:'Përdor sugjerimin e skenarit. Mund të shkruash nëse mikrofoni nuk punon.'},
  reading:{title:'Strategji leximi',de:'Lies zuerst Titel und Fragen. Suche danach Schlüsselwörter im Text.',sq:'Lexo së pari titullin dhe pyetjet. Pastaj kërko fjalët kyçe në tekst.'},
  writing:{title:'Strategji shkrimi',de:'Planen → schreiben → mit der Checkliste kontrollieren.',sq:'Planifiko, shkruaj dhe kontrollo çdo pikë. Modelin hape vetëm pasi të provosh vetë.'},
} as const

export type HelpArea = keyof typeof helpByArea

export function LearningHelp({area}:{area:HelpArea}){
  const [open,setOpen]=useState(false);const item=helpByArea[area]
  return <div className={`learning-help ${open?'open':''}`}>
    <button onClick={()=>setOpen(!open)} aria-expanded={open}><Lightbulb/><span><b>{item.title}</b><small>Ndihmë dhe strategji në shqip</small></span>{open?<X/>:<CircleHelp/>}</button>
    {open&&<div><strong>{item.de}</strong><p>{item.sq}</p></div>}
  </div>
}
