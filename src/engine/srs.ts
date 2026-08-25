import type { ReviewState } from '../types'
const DAY=86400000
export function scheduleReview(previous:ReviewState|undefined,correct:boolean,now=Date.now()):ReviewState {
 const p=previous??{wordId:'',status:'new',nextReview:now,interval:0,correctStreak:0,mistakes:0}
 if(!correct) return {...p,status:'difficult',nextReview:now+DAY,interval:1,correctStreak:0,mistakes:p.mistakes+1}
 const streak=p.correctStreak+1; const interval=streak===1?1:streak===2?3:streak===3?7:Math.min(60,Math.round(Math.max(p.interval,7)*1.8))
 return {...p,status:streak>=4?'mastered':'learning',nextReview:now+interval*DAY,interval,correctStreak:streak}
}
export const dueForReview=(items:ReviewState[],now=Date.now())=>items.filter(i=>i.nextReview<=now&&i.status!=='mastered')
