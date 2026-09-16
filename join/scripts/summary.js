/**
 * Initializes the summary page. Sets greeting, loads tasks, runs mobile animation.
 * @returns {Promise<void>}
 */
async function initSummary() {
  guardPage();
  const user = getCurrentUser();
  updateGreeting(user);
  runMobileGreetingAnimation();
  await loadSummaryData();
}

/**
 * Returns greeting based on time of day.
 * @returns {string} Greeting text
 */
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  else if (hour < 18) return "Good afternoon";
  else return "Good evening";
}

/**
 * Updates greeting text and user name.
 * @param {Object|null} user - User object
 * @returns {void}
 */
function updateGreeting(user) {
  const text = document.getElementById("greeting-text");
  const name = document.getElementById("greeting-name");
  const greeting = getGreeting();
  if (!user || user.isGuest) {
    text.textContent = greeting + "!";
    name.textContent = "";
    return;
  }
  text.textContent = greeting + ",";
  name.textContent = user.name;
}

/**
 * Runs mobile greeting animation (only on screens ≤1024px).
 * @returns {void}
 */
function runMobileGreetingAnimation() {
  const greeting = document.querySelector(".summary-greeting");
  const cards = document.querySelector(".summary-cards");
  setTimeout(() => {
    greeting.classList.add("fade-out");
    cards.classList.add("visible");
  }, 2000);
}

/**
 * Loads all tasks from Firebase.
 * @returns {Promise<void>}
 */
async function loadSummaryData() {
  try {
    const response = await fetch(BASE_URL + "tasks.json");
    if (!response.ok) throw new Error("Tasks unavailable");
    renderMetrics(await response.json() || {});
  } catch {
    document.querySelectorAll(".card-count").forEach(node => node.textContent = "—");
    document.getElementById("deadline-date").textContent = "Data unavailable";
  }
}

/**
 * Renders all counters and deadline info.
 * @param {Object} tasks - Tasks object from Firebase
 * @returns {void}
 */
function renderMetrics(tasks) {
  const taskList = Object.values(tasks).filter(task => task && typeof task === "object");
  renderStatusCounts(taskList);
  renderUrgentSection(taskList);
}

/**
 * Sets status counters and total.
 * @param {Array} taskList - All tasks
 * @returns {void}
 */
function renderStatusCounts(taskList) {
  document.getElementById("count-board").textContent = taskList.length;
  document.getElementById("count-todo").textContent = countByStatus(taskList, "to do");
  document.getElementById("count-progress").textContent = countByStatus(taskList, "in progress");
  document.getElementById("count-feedback").textContent = countByStatus(taskList, "await feedback");
  document.getElementById("count-done").textContent = countByStatus(taskList, "done");
  document.getElementById("count-email-requests").textContent = taskList.filter(
    (task) =>
      task.source === "email" ||
      task.createdVia === "email" ||
      task.ai_generated === true ||
      task.isAiGenerated === true,
  ).length;
}

/**
 * Counts tasks by column value.
 * @param {Array} taskList - All tasks
 * @param {string} column - Column value to match
 * @returns {number} Count
 */
function countByStatus(taskList, column) {
  return taskList.filter((task) => task.column === column).length;
}

/**
 * Renders urgent count and earliest deadline.
 * @param {Array} taskList - All tasks
 * @returns {void}
 */
function renderUrgentSection(taskList) {
  const urgent = taskList.filter((task) => task.priority === "Urgent" && task.column !== "done");
  document.getElementById("count-urgent").textContent = urgent.length;
  const dates = urgent.map(task => task.due_date)
    .filter(date => typeof date === "string" && date.trim() && Number.isFinite(Date.parse(date)))
    .sort((a, b) => Date.parse(a) - Date.parse(b));
  document.getElementById("deadline-date").textContent = formatDeadline(dates[0]);
}

/**
 * Formats date for deadline display.
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
function formatDeadline(dateString) {
  if (!dateString || !Number.isFinite(Date.parse(dateString))) return "No deadline";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

document.addEventListener("DOMContentLoaded", initSummary);
