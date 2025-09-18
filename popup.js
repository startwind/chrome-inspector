const refreshBtn = document.getElementById('refresh');
const downloadBtn = document.getElementById('download');
const clearBtn = document.getElementById('clear');
const list = document.getElementById('list');
const summary = document.getElementById('summary');
const preserveLog = document.getElementById('preserveLog');
chrome.storage.local.get({ preserveLog: false }, (s) => { preserveLog.checked = !!s.preserveLog; });
preserveLog.addEventListener('change', () => { chrome.storage.local.set({ preserveLog: preserveLog.checked }); });

async function getActiveTabId() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab?.id ?? null;
}

function rowHtml(r, idx) {
  const fails = r.failedChecks || [];
  const title = fails.map(f => `${f.name}: ${f.message}`).join('\n');
  const urlCell = `<span class="req-url" title="${r.url}">${r.url}</span>`;
  const badge = `<span class="badge" title="${title}">${fails.length} findings</span>`;
  const toggle = `<span class="toggle" data-idx="${idx}" aria-label="toggle details">▸</span>`;
  const baseRow = `
    <tr class="row" data-idx="${idx}">
      <td>${new Date(r.time).toLocaleString()}</td>
      <td>${r.method || ''}</td>
      <td>${toggle}${urlCell}</td>
      <td>${r.statusCode ?? r.error ?? ''}</td>
      <td>${r.duration ?? ''}</td>
      <td>${badge}</td>
    </tr>
  `;
  const details = fails.map(f => `<li class="finding"><strong>${f.name}:</strong> ${escapeHtml(f.message)}</li>`).join('');
  const detailsRow = `
    <tr class="details" data-for="${idx}" style="display:none;">
      <td colspan="6">
        <ul class="findings">${details}</ul>
      </td>
    </tr>
  `;
  return baseRow + detailsRow;
}

function escapeHtml(s=''){return s.replace(/[&<>"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]));}

async function loadLogs() {
  const tabId = await getActiveTabId();
  const res = await chrome.runtime.sendMessage({ type: 'GET_LOGS', filterTabId: tabId });
  if (!res?.success) {
    list.innerText = 'Fehler beim Laden';
    return;
  }
  const logsAll = res.logs.sort((a,b) => b.time - a.time);
  const logs = logsAll.filter(r => (r.failedChecks || []).length > 0).slice(0, 200);
  summary.innerText = `Tab ${tabId}: ${logs.length} Einträge mit Findings (neueste 200)`;

  const table = document.createElement('table');
  table.innerHTML = '<thead><tr><th>Time</th><th>Method</th><th>URL</th><th>Status</th><th>Duration (ms)</th><th>Findings</th></tr></thead>';
  const tbody = document.createElement('tbody');
  logs.forEach((r, i) => tbody.insertAdjacentHTML('beforeend', rowHtml(r, i)));
  table.appendChild(tbody);
  list.innerHTML = '';
  list.appendChild(table);

  // toggle handlers
  list.querySelectorAll('.toggle').forEach(t => {
    t.addEventListener('click', (e) => {
      const idx = e.currentTarget.getAttribute('data-idx');
      const drow = list.querySelector(`.details[data-for="${idx}"]`);
      if (drow) {
        const open = drow.style.display !== 'none';
        drow.style.display = open ? 'none' : '';
        e.currentTarget.textContent = open ? '▸' : '▾';
      }
    });
  });

  downloadBtn.onclick = () => {
    const blob = new Blob([JSON.stringify(logsAll, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `development-audit-findings-tab${tabId}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
}

refreshBtn.addEventListener('click', loadLogs);
clearBtn.addEventListener('click', async () => {
  const tabId = await getActiveTabId();
  await chrome.runtime.sendMessage({ type: 'CLEAR_LOGS', filterTabId: tabId });
  loadLogs();
});

loadLogs();
