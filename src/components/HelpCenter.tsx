import { BookOpenCheck, CircleHelp, Headphones, Languages, MessageCircle, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const terms=[
  ['der / die / das','artikulli i emrit'],['Akkusativ','rasa e kundrinorit të drejtë: kë/çfarë?'],['Dativ','rasa që shpesh përgjigjet: kujt?'],
  ['Verb auf Position 2','folja e zgjedhuar është pjesa e dytë e fjalisë'],['Nebensatz','fjali e varur; folja zakonisht shkon në fund'],['Partizip II','forma e foljes që përdoret te Perfekt dhe pasiv'],
]

export default function HelpCenter(){const [open,setOpen]=useState(false)
 return <>
  <button className="help-fab" onClick={()=>setOpen(true)} aria-label="Hap ndihmën në shqip"><CircleHelp/><span>Ndihmë</span></button>
  {open&&<div className="help-backdrop" onClick={()=>setOpen(false)}><aside className="help-drawer" onClick={e=>e.stopPropagation()}>
   <header><div><span>DEUTSCH → SHQIP</span><h2>Ndihmë në çdo hap</h2></div><button onClick={()=>setOpen(false)} aria-label="Mbyll"><X/></button></header>
   <p className="help-intro">Kur diçka nuk është e qartë, përdor këtë fjalor të vogël ose hape seksionin përkatës. Progresi yt nuk humbet.</p>
   <section><h3><Languages/> Çfarë do të thotë?</h3>{terms.map(t=><div className="term-row" key={t[0]}><b>{t[0]}</b><span>{t[1]}</span></div>)}</section>
   <section><h3><MessageCircle/> Fraza shpëtimi</h3><div className="rescue-phrase"><b>Was bedeutet das?</b><span>Çfarë do të thotë kjo?</span></div><div className="rescue-phrase"><b>Könnten Sie das bitte wiederholen?</b><span>A mund ta përsërisni ju lutem?</span></div><div className="rescue-phrase"><b>Könnten Sie langsamer sprechen?</b><span>A mund të flisni më ngadalë?</span></div></section>
   <nav><Link to="/grammar" onClick={()=>setOpen(false)}><BookOpenCheck/> Shpjegimet e gramatikës</Link><Link to="/listening" onClick={()=>setOpen(false)}><Headphones/> Ushtro dëgjimin</Link><Link to="/phrasebook" onClick={()=>setOpen(false)}><MessageCircle/> Të gjitha frazat</Link></nav>
   <small className="help-note">Këshillë: aktivizo ose çaktivizo përkthimet te Einstellungen → Lernen.</small>
  </aside></div>}
 </>
}
