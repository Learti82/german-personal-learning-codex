export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    if (url.pathname === '/api/sync') return syncProgress(request, env)
    const response = await env.ASSETS.fetch(request)
    if (response.status !== 404 || request.method !== 'GET') return response
    url.pathname = '/index.html'
    return env.ASSETS.fetch(new Request(url, request))
  },
}

async function syncProgress(request, env) {
  const userId = request.headers.get('oai-authenticated-user-id')
  const email = request.headers.get('oai-authenticated-user-email') || 'private-user'
  if (!userId) return json({ error: 'Hyr me llogarinë ChatGPT për të përdorur cloud sync.' }, 401)
  if (!env.DB) return json({ error: 'Cloud sync nuk është ende aktiv në këtë version.' }, 503)
  if (request.method === 'GET') {
    const row = await env.DB.prepare('SELECT payload, updated_at FROM user_progress WHERE user_id = ?').bind(userId).first()
    if (!row) return json({ data: null, updatedAt: null, email })
    try { return json({ data: JSON.parse(row.payload), updatedAt: row.updated_at, email }) }
    catch { return json({ error: 'Kopja cloud nuk mund të lexohet.' }, 500) }
  }
  if (request.method === 'PUT') {
    const body = await request.json().catch(() => null)
    if (!body?.data) return json({ error: 'Nuk u dërgua progres i vlefshëm.' }, 400)
    const payload = JSON.stringify(body.data)
    if (payload.length > 900000) return json({ error: 'Kopja është shumë e madhe për sinkronizim.' }, 413)
    const updatedAt = Date.now()
    await env.DB.prepare('INSERT INTO user_progress (user_id, email, payload, updated_at) VALUES (?, ?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET email = excluded.email, payload = excluded.payload, updated_at = excluded.updated_at').bind(userId, email, payload, updatedAt).run()
    return json({ data: body.data, updatedAt, email })
  }
  return json({ error: 'Metodë e pambështetur.' }, 405)
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } })
}
