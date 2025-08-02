let projects = JSON.parse(localStorage.getItem("projects")) || [];
const form = document.getElementById("project-form");
const nameInput = document.getElementById("project-name");
const deadlineInput = document.getElementById("project-deadline");
const projectList = document.getElementById("project-list");
const themeBtn = document.getElementById("toggle-theme");

// Toggle dark mode
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Add project
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const newProject = {
    name: nameInput.value,
    deadline: deadlineInput.value,
    tasks: []
  };
  projects.push(newProject);
  saveProjects();
  displayProjects();
  form.reset();
});

// Save to localStorage
function saveProjects() {
  localStorage.setItem("projects", JSON.stringify(projects));
}

// Display all projects
function displayProjects() {
  projectList.innerHTML = "";
  projects.forEach((project, pIndex) => {
    let completed = project.tasks.filter(t => t.done).length;
    let total = project.tasks.length;
    let percent = total ? (completed / total * 100).toFixed(0) : 0;

    const deadlineDate = new Date(project.deadline);
    const today = new Date();
    const diffTime = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
    const daysLeft = diffTime >= 0 ? `${diffTime} days left` : "Deadline passed";

    const div = document.createElement("div");
    div.className = "project";
    div.innerHTML = `
      <h3>${project.name} 
        <button onclick="deleteProject(${pIndex})">🗑️</button>
      </h3>
      <small>Deadline: ${project.deadline} (${daysLeft})</small>
      <div class="progress">
        <div class="progress-bar" style="width:${percent}%"></div>
      </div>
      <form onsubmit="addTask(event, ${pIndex})">
        <input type="text" placeholder="New Task" required />
        <button>➕</button>
      </form>
      <div class="task-list">
        ${project.tasks.map((task, tIndex) => `
          <div class="task">
            <input type="checkbox" onchange="toggleTaskStatus(${pIndex}, ${tIndex})" ${task.done ? "checked" : ""}>
            <span style="text-decoration:${task.done ? "line-through" : "none"}">${task.name}</span>
            <button onclick="deleteTask(${pIndex}, ${tIndex})">❌</button>
          </div>
        `).join("")}
      </div>
    `;
    projectList.appendChild(div);
  });
}

// Add task to project
function addTask(e, projectIndex) {
  e.preventDefault();
  const input = e.target.querySelector("input");
  const task = { name: input.value, done: false };
  projects[projectIndex].tasks.push(task);
  saveProjects();
  displayProjects();
}

// Toggle task status
function toggleTaskStatus(projectIndex, taskIndex) {
  projects[projectIndex].tasks[taskIndex].done = !projects[projectIndex].tasks[taskIndex].done;
  saveProjects();
  displayProjects();
}

// Delete task
function deleteTask(projectIndex, taskIndex) {
  projects[projectIndex].tasks.splice(taskIndex, 1);
  saveProjects();
  displayProjects();
}

// Delete entire project
function deleteProject(projectIndex) {
  if (confirm("Are you sure you want to delete this project?")) {
    projects.splice(projectIndex, 1);
    saveProjects();
    displayProjects();
  }
}

displayProjects();
