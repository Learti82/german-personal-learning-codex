import { BarChart3, BookOpen, BookOpenCheck, BrainCircuit, BriefcaseBusiness, ClipboardCheck, FileText, GraduationCap, Headphones, Home, Layers3, Menu, MessageCircle, Mic2, PenLine, ScanText, ScrollText, Search, Settings, Sparkles, X } from 'lucide-react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import HelpCenter from './HelpCenter'

const nav=[
 {to:'/',label:'Heute',icon:Home},{to:'/learn',label:'Kurs',icon:GraduationCap},{to:'/practice',label:'Üben',icon:Sparkles},{to:'/voice-coach',label:'Mia Coach',icon:Mic2},{to:'/progress',label:'Fortschritt',icon:BarChart3},
]
const more=[{to:'/flashcards',label:'Karteikarten',icon:Layers3},{to:'/mastery',label:'Meine Grammatik',icon:BrainCircuit},{to:'/mistakes',label:'Meine Fehler',icon:BookOpenCheck},{to:'/vocabulary',label:'Wortschatz',icon:BookOpen},{to:'/grammar',label:'Grammatik',icon:MessageCircle},{to:'/listening',label:'Hören',icon:Headphones},{to:'/reading',label:'Lesen',icon:FileText},{to:'/writing',label:'Schreiben',icon:PenLine},{to:'/call-center',label:'Call Center',icon:BriefcaseBusiness},{to:'/importer',label:'Eigene Texte',icon:ScanText},{to:'/phrasebook',label:'Redemittel',icon:ScrollText},{to:'/placement',label:'Einstufungstest',icon:ClipboardCheck},{to:'/tests',label:'Prüfungen',icon:ClipboardCheck},{to:'/settings',label:'Einstellungen',icon:Settings}]
export default function Layout(){
 const profile=useAppStore(s=>s.profile);const progress=useAppStore(s=>s.progress);const [drawer,setDrawer]=useState(false);const [search,setSearch]=useState(false);const loc=useLocation();const navigate=useNavigate()
 useEffect(()=>setDrawer(false),[loc.pathname]);useEffect(()=>{document.documentElement.dataset.theme=profile.theme},[profile.theme])
 const goSearch=(q:string)=>{if(q.trim()){navigate(`/search?q=${encodeURIComponent(q)}`);setSearch(false)}}
 return <div className="app-shell">
  <aside className={`sidebar ${drawer?'open':''}`}>
   <div className="brand"><span className="brand-mark">D<span>•</span></span><div><strong>DeutschCoach</strong><small>DEIN WEG ZU B2</small></div><button className="close-drawer" onClick={()=>setDrawer(false)} aria-label="Mbyll menunë"><X/></button></div>
   <nav aria-label="Navigimi kryesor">{nav.map(n=><NavLink key={n.to} to={n.to} end={n.to==='/'}><n.icon/><span>{n.label}</span></NavLink>)}<div className="nav-rule"/>{more.map(n=><NavLink key={n.to} to={n.to}><n.icon/><span>{n.label}</span></NavLink>)}</nav>
   <div className="sidebar-goal"><div><span>Ziel heute</span><b>{Math.min(progress.daily.completedMinutes,profile.dailyGoal)} / {profile.dailyGoal} min</b></div><div className="mini-track"><i style={{width:`${Math.min(100,progress.daily.completedMinutes/profile.dailyGoal*100)}%`}}/></div><small>Noch {Math.max(0,profile.dailyGoal-progress.daily.completedMinutes)} Minuten. Du schaffst das.</small></div>
   <div className="profile-chip"><div>{profile.name[0]}</div><span><strong>{profile.name}</strong><small>{profile.currentLevel} · {progress.xp} XP</small></span></div>
  </aside>
  {drawer&&<button className="scrim" onClick={()=>setDrawer(false)} aria-label="Mbyll menunë"/>}
  <main className="main"><header className="topbar"><button className="menu-btn" onClick={()=>setDrawer(true)} aria-label="Hap menunë"><Menu/></button><div className="mobile-brand">DeutschCoach</div><button className="search-btn" onClick={()=>setSearch(true)} aria-label="Kërko"><Search/></button></header><Outlet/></main>
  <nav className="bottom-nav" aria-label="Navigimi mobil">{nav.map(n=><NavLink key={n.to} to={n.to} end={n.to==='/'}><n.icon/><span>{n.label}</span></NavLink>)}</nav>
  <HelpCenter/>
  {search&&<div className="modal-backdrop"><form className="search-modal" onSubmit={e=>{e.preventDefault();goSearch(new FormData(e.currentTarget).get('q') as string)}}><Search/><input autoFocus name="q" placeholder="Kërko fjalë, gramatikë, fraza…"/><button type="button" onClick={()=>setSearch(false)}><X/></button></form></div>}
 </div>
}
