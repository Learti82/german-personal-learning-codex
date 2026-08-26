import type { AppSnapshot } from '../store/useAppStore'

type CloudPayload={data:AppSnapshot|null;updatedAt?:number;email?:string}

async function request(method:'GET'|'PUT',data?:AppSnapshot):Promise<CloudPayload>{
 const response=await fetch('/api/sync',{method,headers:{'content-type':'application/json'},body:data?JSON.stringify({data}):undefined})
 const payload=await response.json().catch(()=>({error:'Përgjigje e pavlefshme nga serveri.'}))
 if(!response.ok)throw new Error(payload.error??'Sinkronizimi dështoi.')
 return payload
}

export const cloudSync={pull:()=>request('GET'),push:(data:AppSnapshot)=>request('PUT',data)}
