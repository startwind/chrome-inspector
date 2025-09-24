// background.js (ES module)
import {checks} from "./checks/index.js";

const MAX_LOGS = 2000;
const LOGS = [];
const ports = new Set();

function pushLog(rec) {
    LOGS.push(rec);
    if (LOGS.length > MAX_LOGS) LOGS.shift();

    for (const port of ports) {
        try {
            port.postMessage({type: "NEW_RECORD", record: rec});
        } catch {
        }
    }
}

chrome.runtime.onConnect.addListener((port) => {
    ports.add(port);
    port.onDisconnect.addListener(() => ports.delete(port));
});

const starts = new Map();
const responseHeadersMap = new Map();

function toHeaderMap(headersArr = []) {
    const m = {};
    for (const h of headersArr) if (h?.name) m[h.name.toLowerCase()] = h.value ?? "";
    return m;
}

chrome.webRequest.onBeforeRequest.addListener(
    (d) => {
        starts.set(d.requestId, {time: Date.now()});
    },
    {urls: ["<all_urls>"]}
);

chrome.webRequest.onHeadersReceived.addListener(
    (d) => {
        responseHeadersMap.set(d.requestId, toHeaderMap(d.responseHeaders || []));
    },
    {urls: ["<all_urls>"]},
    ["responseHeaders"]
);

async function runChecks(record) {
    const failedChecks = [];
    const networkChecks = checks.network;
    for (const c of networkChecks) {
        const res = await c.check(record);
        if (res) failedChecks.push(res);
    }
    record.failedChecks = failedChecks;
    pushLog(record);
}

chrome.webRequest.onCompleted.addListener(
    async (d) => {
        const s = starts.get(d.requestId);
        const duration = s ? Date.now() - s.time : undefined;

        let pageUrl = '';
        let content = ''

        if (d.tabId >= 0) {
            try {
                const tab = await chrome.tabs.get(d.tabId);
                pageUrl = tab.url;

                if (d.type === 'main_frame') {
                    const [result] = await chrome.scripting.executeScript({
                        target: {tabId: tab.id, frameIds: [0]}, // frameId 0 = main_frame
                        func: () => document.documentElement.outerHTML
                    });
                    content = result?.result ?? '';
                }
            } catch (e) {
                pageUrl = ''
            }
        }

        const record = {
            url: d.url,
            method: d.method,
            statusCode: d.statusCode,
            type: d.type,
            time: s ? s.time : Date.now(),
            content,
            duration,
            tabId: d.tabId,
            frameId: d.frameId,
            fromCache: !!d.fromCache,
            ip: d.ip || undefined,
            responseHeaders: responseHeadersMap.get(d.requestId),
            pageUrl
        };

        await runChecks(record);
        starts.delete(d.requestId);
        responseHeadersMap.delete(d.requestId);
    },
    {urls: ["<all_urls>"]},
    ["responseHeaders"]
);

chrome.webRequest.onErrorOccurred.addListener(
    async (d) => {
        const s = starts.get(d.requestId);
        const duration = s ? Date.now() - s.time : undefined;
        const record = {
            url: d.url,
            method: d.method,
            type: d.type,
            time: s ? s.time : Date.now(),
            duration,
            tabId: d.tabId,
            frameId: d.frameId,
            error: d.error,
            responseHeaders: responseHeadersMap.get(d.requestId),
            content: ''
        };
        await runChecks(record);
        starts.delete(d.requestId);
        responseHeadersMap.delete(d.requestId);
    },
    {urls: ["<all_urls>"]}
);

chrome.runtime.onMessage.addListener((msg, _s, sendResponse) => {
    if (msg?.type === "GET_LOGS") {
        let logs = [...LOGS];
        if (typeof msg.filterTabId === "number") {
            logs = logs.filter(r => r && r.tabId === msg.filterTabId);
        }
        logs.sort((a, b) => b.time - a.time);
        sendResponse({success: true, logs});
        return;
    }
    if (msg?.type === "CLEAR_LOGS") {
        // optional: tab-scoped clear
        if (typeof msg.filterTabId === "number") {
            for (let i = LOGS.length - 1; i >= 0; i--) {
                if (LOGS[i]?.tabId === msg.filterTabId) LOGS.splice(i, 1);
            }
        } else {
            LOGS.length = 0;
        }
        sendResponse({success: true});
        return;
    }
});
