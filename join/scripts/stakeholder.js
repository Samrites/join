/** Production URL of the supplied public-status workflow. */
const ISSUE_COLLECTOR_STATUS_URL = "https://join-ai-issue-collector.app.n8n.cloud/webhook/join-issue-status";
let requestEmailAddress = "join.issue.collector2026@gmail.com";

document.addEventListener("DOMContentLoaded", () => {
  loadIssueCollectorStatus();
  document
    .getElementById("copy-email-button")
    ?.addEventListener("click", copyRequestEmailAddress);
});

async function loadIssueCollectorStatus() {
  if (!ISSUE_COLLECTOR_STATUS_URL) return;
  try {
    const response = await fetch(ISSUE_COLLECTOR_STATUS_URL);
    if (!response.ok) throw new Error("Status unavailable");
    renderIssueCollectorStatus(await response.json());
  } catch {
    document.getElementById("limit-status").innerHTML = "<strong>0</strong> of <strong>10</strong> requests used today";
    document.getElementById("limit-copy").textContent =
      "Live request counter unavailable. You can still send or copy the email address.";
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
    setRequestEmailAddress(status.email);
  }
}

/** Keeps the mail link and mail-client-independent fallback in sync. */
function setRequestEmailAddress(email) {
  requestEmailAddress = email;
  document.getElementById("request-email-link").href =
    `mailto:${encodeURIComponent(email)}?subject=Join%20Feature%20Request`;
  const addressLabel = document.getElementById("request-email-address");
  addressLabel.textContent = email;
  addressLabel.dataset.emailReady = "true";
  document.getElementById("copy-email-button").disabled = false;
}

/** Copies the collector address without requiring a configured mail app. */
async function copyRequestEmailAddress() {
  const status = document.getElementById("copy-email-status");
  if (!requestEmailAddress) {
    status.textContent = "Email address is not available yet.";
    return;
  }

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(requestEmailAddress);
    } else {
      copyTextWithSelectionFallback(requestEmailAddress);
    }
    status.textContent = "Email address copied.";
  } catch {
    status.textContent = `Copy this address: ${requestEmailAddress}`;
  }
}

/** Copies text in older browsers and local Live Server environments. */
function copyTextWithSelectionFallback(text) {
  const input = document.createElement("textarea");
  input.value = text;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.appendChild(input);
  input.select();
  const copied = document.execCommand("copy");
  input.remove();
  if (!copied) throw new Error("Copy command failed");
}
