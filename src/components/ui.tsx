import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Check, Flame, Volume2 } from 'lucide-react'
import { speakGerman } from '../engine/coach'
import type { GermanLevel } from '../types'

export const Card=({children,className=''}:{children:ReactNode;className?:string})=><section className={`card ${className}`}>{children}</section>
export const Button=({children,className='',variant='primary',...props}:ButtonHTMLAttributes<HTMLButtonElement>&{variant?:'primary'|'secondary'|'ghost'|'danger'})=><button className={`btn btn-${variant} ${className}`} {...props}>{children}</button>
export const ProgressBar=({value,color}:{value:number;color?:string})=><div className="progress-track" role="progressbar" aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100}><span style={{width:`${Math.min(100,value)}%`,background:color}} /></div>
export const LevelBadge=({level}:{level:GermanLevel})=><span className={`level-badge level-${level.toLowerCase()}`}>{level}</span>
export const AudioButton=({text,label='Dëgjo'}:{text:string;label?:string})=><button className="audio-btn" onClick={()=>speakGerman(text)} aria-label={`${label}: ${text}`}><Volume2 size={17}/>{label}</button>
export const StatCard=({icon,value,label,tone='green'}:{icon:ReactNode;value:string|number;label:string;tone?:string})=><Card className={`stat stat-${tone}`}><span className="stat-icon">{icon}</span><div><strong>{value}</strong><span>{label}</span></div></Card>
export const Streak=({days}:{days:number})=><div className="streak"><Flame size={18}/><strong>{days}</strong><span>ditë radhazi</span></div>
export const CheckMark=()=> <span className="check"><Check size={14}/></span>
