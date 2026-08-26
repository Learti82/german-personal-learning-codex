import { describe, expect, it, vi } from 'vitest'
import worker from '../../public/server/index.js'

describe('private cloud sync worker',()=>{
 it('rejects sync without a signed-in user',async()=>{const response=await worker.fetch(new Request('https://site.test/api/sync'),{DB:{},ASSETS:{fetch:vi.fn()}});expect(response.status).toBe(401)})
 it('stores progress under the authenticated user id',async()=>{const run=vi.fn().mockResolvedValue({success:true});const bind=vi.fn(()=>({run}));const prepare=vi.fn(()=>({bind}));const request=new Request('https://site.test/api/sync',{method:'PUT',headers:{'content-type':'application/json','oai-authenticated-user-id':'user-1','oai-authenticated-user-email':'learner@example.com'},body:JSON.stringify({data:{progress:{xp:42}}})});const response=await worker.fetch(request,{DB:{prepare},ASSETS:{fetch:vi.fn()}});expect(response.status).toBe(200);expect(prepare).toHaveBeenCalledWith(expect.stringContaining('ON CONFLICT'));expect(bind).toHaveBeenCalledWith('user-1','learner@example.com',expect.any(String),expect.any(Number));expect(run).toHaveBeenCalled()})
})
