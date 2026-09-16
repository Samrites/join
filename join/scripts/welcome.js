/** Keep existing login handlers and paths; the public entry is always Welcome. */
function showEntryView() {
  const login = window.location.hash === "#login";
  document.body.classList.toggle("welcome-mode", !login);
  document.title = login ? "Join - Log in" : "Join - Welcome";
  document.getElementById("login-form").hidden = !login;
  document.querySelector(".welcome-card").hidden = login;
}
window.addEventListener("hashchange", showEntryView);
showEntryView();
