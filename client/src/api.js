const API_URL = 'http://localhost:4000'

function getToken() {
  return localStorage.getItem('token') || ''
}

export async function api(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) headers['Authorization'] = 'Bearer ' + getToken()
  let res
  try {
    res = await fetch(API_URL + path, { method, headers, body: body ? JSON.stringify(body) : undefined, mode: 'cors' })
  } catch (e) {
    throw new Error('Network error: ' + e.message)
  }
  const contentType = res.headers.get('content-type') || ''
  if (!res.ok) {
    let err = 'Error'
    if (contentType.includes('application/json')) {
      const j = await res.json()
      err = j.error || err
    }
    throw new Error(err)
  }
  if (contentType.includes('application/json')) return res.json()
  return res.arrayBuffer()
}

export async function downloadBill(id) {
  const buf = await api('/appointments/' + id + '/bill', { auth: true })
  const blob = new Blob([buf], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'bill_' + id + '.pdf'
  a.click()
  URL.revokeObjectURL(url)
}
