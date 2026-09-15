/** Production URL of the supplied public-status workflow. */
const ISSUE_COLLECTOR_STATUS_URL = "https://join-ai-issue-collector.app.n8n.cloud/webhook/join-issue-status";
document.addEventListener("DOMContentLoaded", loadIssueCollectorStatus);

async function loadIssueCollectorStatus() {
  if (!ISSUE_COLLECTOR_STATUS_URL) return;
  try {
    const response = await fetch(ISSUE_COLLECTOR_STATUS_URL);
    if (!response.ok) throw new Error("Status unavailable");
    renderIssueCollectorStatus(await response.json());
  } catch {
    document.getElementById("limit-status").innerHTML = "<strong>0</strong> of <strong>10</strong> requests used today";
    document.getElementById("limit-copy").textContent = "";
  }
}

function renderIssueCollectorStatus(status) {
  const used = Number(status.used);
  const limit = Number(status.limit);
  if (!Number.isInteger(used) || used < 0 || !Number.isInteger(limit) || limit < 1) {
    throw new Error("Invalid usage data");
  }
  document.getElementById("limit-status").innerHTML = `<strong>${used}</strong> of <strong>${limit}</strong> requests used today`;
  document.getElementById("limit-copy").textContent = used >= limit
    ? "Daily limit reached. You can still email us, but no additional AI ticket will be created automatically today."
    : "";
  if (typeof status.email === "string" && /^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(status.email)) {
    document.getElementById("request-email-link").href = `mailto:${encodeURIComponent(status.email)}?subject=Join%20Feature%20Request`;
  }
}
