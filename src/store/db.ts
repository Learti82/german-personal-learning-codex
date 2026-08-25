import Dexie, { type EntityTable } from 'dexie'
import type { StateStorage } from 'zustand/middleware'

interface LocalRecord { key:string; value:string; updatedAt:number }
class DeutschCoachDB extends Dexie {
 records!:EntityTable<LocalRecord,'key'>
 constructor(){super('DeutschCoachDB');this.version(1).stores({records:'key, updatedAt'})}
}
export const db=new DeutschCoachDB()
const fallback=typeof window!=='undefined'?window.localStorage:undefined
export const indexedDBStorage:StateStorage={
 async getItem(name){try{return (await db.records.get(name))?.value??null}catch{return fallback?.getItem(name)??null}},
 async setItem(name,value){try{await db.records.put({key:name,value,updatedAt:Date.now()})}catch{fallback?.setItem(name,value)}},
 async removeItem(name){try{await db.records.delete(name)}catch{fallback?.removeItem(name)}}
}
