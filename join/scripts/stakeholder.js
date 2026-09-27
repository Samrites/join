/**
 * Production URL of the public issue-status workflow.
 */
const ISSUE_COLLECTOR_STATUS_URL =
  "https://join-ai-issue-collector.app.n8n.cloud/webhook/join-issue-status";

const NORMAL_REQUEST_IMAGE =
  "../assets/imgs/figma-request-board.png";

const LIMIT_REACHED_IMAGE =
  "../assets/imgs/artboard.png";

let requestEmailAddress =
  "join.issue.collector2026@gmail.com";

document.addEventListener("DOMContentLoaded", () => {
  loadIssueCollectorStatus();

  const copyButton =
    document.getElementById("copy-email-button");

  if (copyButton) {
    copyButton.addEventListener(
      "click",
      copyRequestEmailAddress
    );
  }
});

/**
 * Loads the current number of AI-created requests from n8n.
 */
async function loadIssueCollectorStatus() {
  try {
    const response = await fetch(
      ISSUE_COLLECTOR_STATUS_URL,
      {
        method: "GET",
        cache: "no-store"
      }
    );

    if (!response.ok) {
      throw new Error(
        `Status request failed: ${response.status}`
      );
    }

    const status = await response.json();

    renderIssueCollectorStatus(status);
  } catch (error) {
    console.error(
      "Could not load issue collector status:",
      error
    );

    renderStatusFallback();
  }
}

/**
 * Renders the current daily request status.
 */
function renderIssueCollectorStatus(status) {
  const used = Number(status.used);
  const limit = Number(status.limit);

  if (
    !Number.isInteger(used) ||
    used < 0 ||
    !Number.isInteger(limit) ||
    limit < 1
  ) {
    throw new Error("Invalid usage data");
  }

  const safeUsed = Math.min(used, limit);

  const limitStatus =
    document.getElementById("limit-status");

  if (limitStatus) {
    limitStatus.innerHTML =
      `<strong>${safeUsed}</strong> of ` +
      `<strong>${limit}</strong> requests used today`;
  }

  if (
    typeof status.email === "string" &&
    /^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(
      status.email
    )
  ) {
    setRequestEmailAddress(status.email);
  }

  if (used >= limit) {
    showLimitReachedView();
  } else {
    showNormalRequestView();
  }
}

/**
 * Normal stakeholder view:
 * 0 to 9 requests used.
 */
function showNormalRequestView() {
  document.body.classList.remove(
    "limit-reached"
  );

  const headline =
    document.getElementById(
      "request-headline"
    );

  const paragraphOne =
    document.getElementById(
      "request-paragraph-one"
    );

  const paragraphTwo =
    document.getElementById(
      "request-paragraph-two"
    );

  const actionLabel =
    document.getElementById(
      "action-label"
    );

  const illustration =
    document.getElementById(
      "request-illustration"
    );

  if (headline) {
    headline.textContent =
      "Easily create a ticket by sending an email — no extra steps needed.";
  }

  if (paragraphOne) {
    paragraphOne.textContent =
      "On this platform, you can submit your feature requests via email. Our AI system will automatically generate a ticket with a deadline and priority level.";
  }

  if (paragraphTwo) {
    paragraphTwo.textContent =
      "A total of 10 requests can be created per day. After this limit, emails can still be sent, but they will be manually reviewed by our team instead of generating AI tickets.";
  }

  if (actionLabel) {
    actionLabel.textContent =
      "Create Email Request";
  }

  if (illustration) {
    illustration.src =
      NORMAL_REQUEST_IMAGE;

    illustration.alt =
      "Person next to a Kanban board";
  }
}

/**
 * Limit view:
 * 10 of 10 requests used.
 */
function showLimitReachedView() {
  document.body.classList.add(
    "limit-reached"
  );

  const headline =
    document.getElementById(
      "request-headline"
    );

  const paragraphOne =
    document.getElementById(
      "request-paragraph-one"
    );

  const paragraphTwo =
    document.getElementById(
      "request-paragraph-two"
    );

  const actionLabel =
    document.getElementById(
      "action-label"
    );

  const illustration =
    document.getElementById(
      "request-illustration"
    );

  if (headline) {
    headline.textContent =
      "The daily 10-request limit has been reached!";
  }

  if (paragraphOne) {
    paragraphOne.textContent =
      "Need more? No worries — you can still send emails, but our team will review them manually instead of using AI to create tickets.";
  }

  if (paragraphTwo) {
    paragraphTwo.textContent = "";
  }

  if (actionLabel) {
    actionLabel.textContent =
      "Send an email";
  }

  if (illustration) {
    illustration.src =
      LIMIT_REACHED_IMAGE;

    illustration.alt =
      "Person next to a Kanban board";
  }
}

/**
 * Updates the email address everywhere.
 */
function setRequestEmailAddress(email) {
  requestEmailAddress = email;

  const emailLink =
    document.getElementById(
      "request-email-link"
    );

  const addressLabel =
    document.getElementById(
      "request-email-address"
    );

  const copyButton =
    document.getElementById(
      "copy-email-button"
    );

  if (emailLink) {
    emailLink.href =
      `mailto:${encodeURIComponent(email)}` +
      "?subject=Join%20Feature%20Request";
  }

  if (addressLabel) {
    addressLabel.textContent = email;
  }

  if (copyButton) {
    copyButton.disabled = false;
  }
}

/**
 * Fallback if the n8n status endpoint
 * cannot be loaded.
 */
function renderStatusFallback() {
  showNormalRequestView();

  const limitStatus =
    document.getElementById(
      "limit-status"
    );

  if (limitStatus) {
    limitStatus.innerHTML =
      "<strong>0</strong> of " +
      "<strong>10</strong> requests used today";
  }
}

/**
 * Copies the request email address.
 */
async function copyRequestEmailAddress() {
  const status =
    document.getElementById(
      "copy-email-status"
    );

  if (!requestEmailAddress) {
    if (status) {
      status.textContent =
        "Email address is not available yet.";
    }

    return;
  }

  try {
    if (
      navigator.clipboard &&
      window.isSecureContext
    ) {
      await navigator.clipboard.writeText(
        requestEmailAddress
      );
    } else {
      copyTextWithSelectionFallback(
        requestEmailAddress
      );
    }

    if (status) {
      status.textContent =
        "Email address copied.";
    }
  } catch (error) {
    if (status) {
      status.textContent =
        `Copy this address: ${requestEmailAddress}`;
    }
  }
}

/**
 * Clipboard fallback.
 */
function copyTextWithSelectionFallback(text) {
  const input =
    document.createElement("textarea");

  input.value = text;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.opacity = "0";

  document.body.appendChild(input);

  input.select();

  const copied =
    document.execCommand("copy");

  input.remove();

  if (!copied) {
    throw new Error(
      "Copy command failed"
    );
  }
}