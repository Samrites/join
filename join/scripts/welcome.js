/** Switches the index between the Figma Welcome entry and the existing login view. */
function showEntryView() {
  const loginMode = window.location.hash === "#login";
  const loginForm = document.getElementById("login-form");
  const welcomeCard = document.querySelector(".welcome-card");
  document.body.classList.toggle("welcome-mode", !loginMode);
  document.title = loginMode ? "Join - Log in" : "Join - Welcome";
  if (loginForm) loginForm.hidden = !loginMode;
  if (welcomeCard) welcomeCard.hidden = loginMode;
  if (loginMode) requestAnimationFrame(() => document.getElementById("login-email")?.focus());
}
window.addEventListener("hashchange", showEntryView);
window.addEventListener("DOMContentLoaded", showEntryView);
