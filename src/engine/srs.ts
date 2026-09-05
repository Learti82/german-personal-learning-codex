import type { ReviewState } from '../types'
const DAY=86400000
const MINUTE=60000
export type ReviewGrade='again'|'hard'|'good'|'easy'
export function scheduleReview(previous:ReviewState|undefined,correct:boolean,now=Date.now()):ReviewState {
 const p=previous??{wordId:'',status:'new',nextReview:now,interval:0,correctStreak:0,mistakes:0}
 if(!correct) return {...p,status:'difficult',nextReview:now+DAY,interval:1,correctStreak:0,mistakes:p.mistakes+1}
 const streak=p.correctStreak+1; const interval=streak===1?1:streak===2?3:streak===3?7:Math.min(60,Math.round(Math.max(p.interval,7)*1.8))
 return {...p,status:streak>=4?'mastered':'learning',nextReview:now+interval*DAY,interval,correctStreak:streak}
}
export const dueForReview=(items:ReviewState[],now=Date.now())=>items.filter(i=>i.nextReview<=now&&i.status!=='mastered')

export function scheduleReviewGrade(previous:ReviewState|undefined,grade:ReviewGrade,now=Date.now()):ReviewState{
 const p=previous??{wordId:'',status:'new',nextReview:now,interval:0,correctStreak:0,mistakes:0}
 if(grade==='again')return{...p,status:'difficult',nextReview:now+10*MINUTE,interval:0,correctStreak:0,mistakes:p.mistakes+1}
 if(grade==='hard'){const interval=Math.max(1,Math.ceil((p.interval||1)*1.2));return{...p,status:'learning',nextReview:now+interval*DAY,interval,correctStreak:p.correctStreak}}
 if(grade==='easy'){const interval=Math.max(4,Math.ceil((p.interval||1)*2.5));return{...p,status:interval>=21?'mastered':'learning',nextReview:now+interval*DAY,interval,correctStreak:p.correctStreak+2}}
 return scheduleReview(p,true,now)
}
