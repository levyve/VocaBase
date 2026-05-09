const VERSIONS = ['v1','v2','v3','v4','v5','v6'];
const API = 'http://localhost:3000';
 
/* STATE */
let currentMethod = 'GET';
let currentPage = 1;
const PAGE_SIZE = 25;
let cachedData = []; 
 
const METHOD_COLORS = {
  GET: '#00f5ff',
  POST: '#39ff14',
  PUT: '#ffcc00',
  DELETE: '#ff3366'
};
const ENDPOINTS = {
  GET: '/vocaloids',
  POST: '/vocaloids',
  PUT: '/vocaloids/:name',
  DELETE: '/vocaloids/:name'
};
 
function switchMethod(method) {
  currentMethod = method;
  currentPage = 1;
 
  document.querySelectorAll('.method-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.method-btn[data-method="${method}"]`).classList.add('active');
 
  const color = METHOD_COLORS[method];
  document.getElementById('panel').style.setProperty('--active-color', color);
  document.getElementById('panel-method-tag').textContent = method;
  document.getElementById('panel-method-tag').style.color = color;
  document.getElementById('panel-method-tag').style.textShadow = `0 0 10px ${color}`;
  document.getElementById('panel-endpoint').textContent = ENDPOINTS[method];
 
  ['GET','POST','PUT','DELETE'].forEach(m => {
    document.getElementById(`view-${m}`).style.display = m === method ? '' : 'none';
  });
 
  hideResponse();
  if (method === 'GET') loadAndRenderTable();
}
 
/* ── GET ── */
async function loadAndRenderTable() {
  const tbody = document.getElementById('table-body');
  tbody.innerHTML = '<tr class="loading-row"><td colspan="4"><span class="loading-text">Carregando...</span></td></tr>';
 
  try {
    const res = await fetch(`${API}/vocaloids`);
    cachedData = await res.json();
    cachedData.sort((a, b) => a.name.localeCompare(b.name));
    renderTable();
  } catch (err) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="4">Erro ao conectar com o servidor</td></tr>';
  }
}
 
function renderTable() {
  const total = cachedData.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const start = (currentPage - 1) * PAGE_SIZE;
  const slice = cachedData.slice(start, start + PAGE_SIZE);
 
  const tbody = document.getElementById('table-body');
  if (slice.length === 0) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="4">Nenhum vocaloid encontrado</td></tr>';
  } else {
    tbody.innerHTML = slice.map(v => {
      const badges = VERSIONS.map(ver =>
        `<span class="vbadge ${v[ver] ? '' : 'off'}">${ver.toUpperCase()}</span>`
      ).join('');
      return `<tr>
        <td class="td-name">${v.name}</td>
        <td class="td-release">${v.release}</td>
        <td class="td-affil">${v.affiliation}</td>
        <td><div class="version-badges">${badges}</div></td>
      </tr>`;
    }).join('');
  }
 
  renderPagination(totalPages);
}
 
function renderPagination(totalPages) {
  const pg = document.getElementById('pagination');
  if (totalPages <= 1) { pg.innerHTML = ''; return; }
 
  const range = 2;
  const start = Math.max(1, currentPage - range);
  const end = Math.min(totalPages, currentPage + range);
  let html = '';
 
  html += `<button class="page-btn" onclick="goPage(${currentPage-1})" ${currentPage===1?'disabled':''}>&#8592;</button>`;
 
  if (start > 1) {
    html += `<button class="page-btn" onclick="goPage(1)">1</button>`;
    if (start > 2) html += `<span class="page-info">…</span>`;
  }
 
  for (let i = start; i <= end; i++) {
    html += `<button class="page-btn ${i===currentPage?'active':''}" onclick="goPage(${i})">${i}</button>`;
  }
 
  if (end < totalPages) {
    if (end < totalPages - 1) html += `<span class="page-info">…</span>`;
    html += `<button class="page-btn" onclick="goPage(${totalPages})">${totalPages}</button>`;
  }
 
  html += `<button class="page-btn" onclick="goPage(${currentPage+1})" ${currentPage===totalPages?'disabled':''}>&#8594;</button>`;
  html += `<span class="page-info">${(currentPage-1)*PAGE_SIZE+1}–${Math.min(currentPage*PAGE_SIZE, cachedData.length)} de ${cachedData.length}</span>`;
 
  pg.innerHTML = html;
}
 
function goPage(p) {
  const total = Math.ceil(cachedData.length / PAGE_SIZE);
  if (p < 1 || p > total) return;
  currentPage = p;
  renderTable();
}
 
/* ── POST ── */
async function handlePost() {
  const name    = document.getElementById('post-name').value.trim();
  const release = document.getElementById('post-release').value.trim();
  const affil   = document.getElementById('post-affil').value.trim();
 
  if (!name || !release || !affil) {
    showResponse(400, { error: 'Campos obrigatórios: name, release, affiliation' }, 'err');
    return;
  }
 
  const versions = {};
  VERSIONS.forEach(ver => {
    versions[ver] = !!document.querySelector(`#post-versions input[value="${ver}"]`).checked;
  });
 
  const body = { name, release: parseInt(release), affiliation: affil, ...versions };
 
  try {
    const res = await fetch(`${API}/vocaloids`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    showResponse(res.status, data, res.ok ? 'ok' : 'err');
    if (res.ok) clearForm('POST');
  } catch (err) {
    showResponse(500, { error: 'Erro ao conectar com o servidor' }, 'err');
  }
}
 
/* ── PUT ── */
async function handlePut() {
  const name = document.getElementById('put-name').value.trim();
  if (!name) {
    showResponse(400, { error: 'O campo name é obrigatório' }, 'err');
    return;
  }
 
  const release = document.getElementById('put-release').value.trim();
  const affil   = document.getElementById('put-affil').value.trim();
  const body    = {};
 
  if (release) body.release = parseInt(release);
  if (affil)   body.affiliation = affil;
 
  VERSIONS.forEach(ver => {
    body[ver] = !!document.querySelector(`#put-versions input[value="${ver}"]`).checked;
  });
 
  try {
    const res = await fetch(`${API}/vocaloids/${encodeURIComponent(name)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    showResponse(res.status, data, res.ok ? 'ok' : 'err');
    if (res.ok) clearForm('PUT');
  } catch (err) {
    showResponse(500, { error: 'Erro ao conectar com o servidor' }, 'err');
  }
}
 
/* ── DELETE ── */
async function handleDelete() {
  const name = document.getElementById('delete-name').value.trim();
  if (!name) {
    showResponse(400, { error: 'O campo name é obrigatório' }, 'err');
    return;
  }
 
  try {
    const res = await fetch(`${API}/vocaloids/${encodeURIComponent(name)}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    showResponse(res.status, data, res.ok ? 'warn' : 'err');
    if (res.ok) clearForm('DELETE');
  } catch (err) {
    showResponse(500, { error: 'Erro ao conectar com o servidor' }, 'err');
  }
}
 
/* ── RESPONSE ── */
function showResponse(status, body, type) {
  const area   = document.getElementById('response-area');
  const badge  = document.getElementById('status-badge');
  const bodyEl = document.getElementById('response-body');
 
  const labels = { 200: '200 OK', 201: '201 Created', 400: '400 Bad Request', 404: '404 Not Found', 409: '409 Conflict', 500: '500 Server Error' };
  badge.textContent = labels[status] || String(status);
  badge.className = 'status-badge ' + (type === 'ok' ? 'status-ok' : type === 'warn' ? 'status-warn' : 'status-err');
  bodyEl.textContent = JSON.stringify(body, null, 2);
  area.style.display = '';
}
 
function hideResponse() {
  document.getElementById('response-area').style.display = 'none';
}
 
function clearForm(method) {
  if (method === 'POST') {
    ['post-name','post-release','post-affil'].forEach(id => document.getElementById(id).value = '');
    document.querySelectorAll('#post-versions input').forEach(cb => cb.checked = false);
  } else if (method === 'PUT') {
    ['put-name','put-release','put-affil'].forEach(id => document.getElementById(id).value = '');
    document.querySelectorAll('#put-versions input').forEach(cb => cb.checked = false);
  } else if (method === 'DELETE') {
    document.getElementById('delete-name').value = '';
  }
  hideResponse();
}
 
/* ── INIT ── */
document.getElementById('panel').style.setProperty('--active-color', METHOD_COLORS['GET']);
loadAndRenderTable();
