# n8n setup

## Workflow files for review

- `issue-collector.json` — main email-to-ticket workflow
- `public-status.json` — public daily-limit status endpoint
- `status-notification.json` — external creator status email
- `error-handler.json` — workflow error notification

An imported workflow is not automatically live. Open every imported workflow,
select the required credentials, resolve all red node warnings, save it and use
the **Publish/Active** control in the upper-right corner. The production webhook
does not exist while its workflow is inactive.

Import all JSON workflows and select your own IMAP and SMTP credentials inside n8n. Never commit exported credentials. The main workflow marks processed messages as read and ignores Google account-security messages from `no-reply@accounts.google.com`, so those notifications cannot become Join tickets.

## Required configuration

- `GEMINI_API_KEY`
- IMAP and SMTP credentials for `join.issue.collector2026@gmail.com`
- Firebase Realtime Database URL (already present in the review workflow)
- Timezone `Europe/Zurich`
- Daily limit `10`

The Gemini prompt returns `due_date` and up to five `subtasks`. Relative dates such as “morgen” or “in 2 Tagen” are calculated from the received email date. The validation node converts subtask titles into Join's `{ title, done }` schema before the Firebase write.

After activating `Join - External Creator Status Notification`, copy its production webhook URL into `scripts/config.js`. The URL is not a password, but Firebase and n8n must still validate all incoming data.

After activating `Join - Public Issue Collector Status`, copy its production webhook URL into `scripts/stakeholder.js`. Set the main collector workflow concurrency to 1 so two simultaneous emails cannot race the daily counter in this demo implementation.

## Required acceptance test before submission

1. Open `https://join-ai-issue-collector.app.n8n.cloud/webhook/join-issue-status`.
   It must return JSON containing `used`, `limit` and `email`; a 404 means the
   public-status workflow is not active.
2. Send one email to the configured issue-collector mailbox.
3. Confirm a successful execution of `Join - AI Issue Collector` in n8n.
4. Confirm that exactly one new ticket appears in the Join **Triage** column.
5. Confirm that the sender receives the creation email.
6. Change the ticket status and confirm the external status email.
7. Refresh the stakeholder page and confirm that the usage number increased.

Do not submit while any of these checks fail. The exported JSON documents the
workflow, but it cannot carry account passwords or API keys to another account.

Create the mailbox folders `erledigt` and `zu bearbeiten`. Configure an n8n error workflow to notify the sender, then move failed emails to `zu bearbeiten`. After a successful confirmation, add an IMAP move node for `erledigt`; the exact node/operation depends on the mail provider and installed n8n version.

For a production deployment, use Firebase Authentication and restrictive Realtime Database rules. Do not use the legacy plaintext-password login as a security boundary.
