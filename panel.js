// Development Audit Panel
const list = document.getElementById('list');
const refreshBtn = document.getElementById('refresh');
const filterUrl = document.getElementById('filterUrl');
const filterMethod = document.getElementById('filterMethod');
const filterSeverity = document.getElementById('filterSeverity');
const preserveLog = document.getElementById('preserveLog');
const statusEl = document.getElementById('status');

let data = [];
const currentTabId = chrome.devtools.inspectedWindow.tabId;

// Load preserve setting
chrome.storage.local.get({preserveLog: false}, (s) => {
    preserveLog.checked = !!s.preserveLog;
});

preserveLog.addEventListener('change', () => {
    chrome.storage.local.set({preserveLog: preserveLog.checked});
});

const port = chrome.runtime.connect();
port.onMessage.addListener((msg) => {
    if (msg?.type === 'NEW_RECORD') {
        if (msg.record && msg.record.tabId === currentTabId && (msg.record.failedChecks || []).length > 0) {
            data.push(msg.record);
            render(); // live update only findings
        }
    }
});

// Clear on navigation when preserveLog is off
chrome.devtools.network.onNavigated.addListener(() => {
    if (!preserveLog.checked) {
        data = [];
        render();
    }
});

async function fetchInitial() {
    const res = await chrome.runtime.sendMessage({type: 'GET_LOGS', filterTabId: currentTabId});
    const logs = res?.success ? res.logs : [];
    data = logs.filter(r => (r.failedChecks || []).length > 0);
}

function rowHtml(r, idx) {
    const fails = r.failedChecks || [];
    const title = '<ul>' + fails.map(f => `<li class="finding-${f.severity}">${escapeHtml(f.message)}</li>`).join('') + '</ul>';

    let tags = [];

    if (r.type === 'xmlhttprequest') {
        tags.push('XHR');
    } else if (r.type === 'script') {
        tags.push('JavaScript');
    } else {
        tags.push(r.type);
    }

    tags.push(r.duration + ' ms')
    if (r.statusCode) tags.push(r.statusCode)
    tags.push(r.method)

    const tagList = tags.map(t => `<span class="tag">${t}</span>`).join('');

    return `<div class="finding">
        <div class="time">${r.time ? new Date(r.time).toLocaleTimeString() : ""} | <a href="${r.pageUrl}" target="_blank" rel="noopener noreferrer">${r.pageUrl ? r.pageUrl.replace('https://', '') : ""}</a> </div>
        <div class="url-line">
          <span class="url">
            <a href="${r.url}" target="_blank" rel="noopener noreferrer">${r.url.replace('https://', '')}</a>
          </span>
          ${tagList}
        </div>
         <div class="findings">
            ${title}
         </div>
        <div style="clear:both"></div>
    </div>`
}

function escapeHtml(s = '') {
    return s.replace(/[&<>"]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;"}[c]));
}

function render() {
    const urlPart = (filterUrl.value || '').toLowerCase();
    const method = filterMethod.value;
    const severity = filterSeverity.value;
    const rows = data.filter(r => {
        if (r.tabId !== currentTabId) return false;
        if ((r.failedChecks || []).length === 0) return false;

        let appliedSeverities = [];

        r.failedChecks.forEach(failedCheck => {
            appliedSeverities.push(failedCheck.severity)
        })

        if (severity && !appliedSeverities.includes(severity)) return false;

        const okUrl = !urlPart || (r.url || '').toLowerCase().includes(urlPart);
        const okMethod = !method || r.method === method;
        return okUrl && okMethod;
    }).sort((a, b) => b.time - a.time);

    statusEl.innerHTML = `<strong>${rows.length}</strong> anomalies found`;

    const table = document.createElement('div');
    table.classList.add('findingsBlock');

    // table.innerHTML = '<thead><tr><th>Time</th><th>Method</th><th>URL</th><th>Status</th><th>Duration</th><th>Findings</th></tr></thead>';
    const div = document.createElement('div');
    rows.forEach((r, i) => {
        div.insertAdjacentHTML('beforeend', rowHtml(r, i));
    });

    table.appendChild(div);

    list.innerHTML = '';
    list.appendChild(table);

    // toggle handling
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
}

async function load() {
    await fetchInitial();
    render();
}

// refreshBtn.addEventListener('click', load);
filterUrl.addEventListener('input', render);
filterMethod.addEventListener('change', render);
filterSeverity.addEventListener('change', render);

load();
