export async function getConfig() {
  const defaults = {
    slowThresholdMs: 800,
    statusCodeWarnFrom: 400,
    domainBlacklist: ["example.com"]
  };
  return new Promise((resolve) => {
    chrome.storage.sync.get(defaults, resolve);
  });
}
