let tasks = [];
let currentFilter = "all";

const API_URL = "https://todo-backend-0coe.onrender.com/todolist";


// Load tasks
window.addEventListener("DOMContentLoaded", function () {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      tasks = data;
      render();
    });
});


// ADD TASK
function addTask() {
  const input = document.getElementById("taskInput");

  if (input.value.trim() === "") {
    alert("Please enter a task!");
    return;
  }

  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userTask: input.value.trim(),
      completed: false
    })
  })
    .then(res => res.json())
    .then(newTask => {
      tasks.push(newTask);
      input.value = "";
      render();
    });
}


// TOGGLE COMPLETE
// function toggleTask(id) {
//   const task = tasks.find(t => t._id === id);

//   fetch(API_URL + "/" + id, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ status: !task.status })
//   })
//     .then(() => {
//       task.status = !task.status;
//       render();
//       checkAllCompleted();
//     });
// }

function toggleTask(id) {
  const task = tasks.find(t => t._id === id);

  fetch(API_URL + "/" + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed: !task.completed })
  })
    .then(res => res.json())
    .then(updatedTask => {
      const index = tasks.findIndex(t => t._id === id);
      tasks[index] = updatedTask;
      render();
    });
}


// DELETE TASK
function deleteTask(id) {
  fetch(API_URL + "/" + id, {
    method: "DELETE"
  })
    .then(() => {
      tasks = tasks.filter(t => t._id !== id);
      render();
    });
}


// EDIT TASK
// function editTask(id) {
//   const newText = prompt("Edit task:");

//   if (!newText || newText.trim() === "") return;

//   fetch(API_URL + "/" + id, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ userTask: newText.trim() })
//   })
//     .then(() => {
//       const task = tasks.find(t => t._id === id);
//       task.userTask = newText.trim();
//       render();
//     });
// }

function editTask(id) {
  const newText = prompt("Edit task:");
  if (!newText || newText.trim() === "") return;

  fetch(API_URL + "/" + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userTask: newText.trim() })
  })
    .then(res => res.json())
    .then(updatedTask => {
      const index = tasks.findIndex(t => t._id === id);
      tasks[index] = updatedTask;
      render();
    });
}



// FILTER
function filterTasks(type) {
  currentFilter = type;
  render();
}


// RENDER (No Drag & Drop)
function render() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  let filtered = tasks.filter(t => {
    if (currentFilter === "completed") return t.completed === true;
    if (currentFilter === "pending") return t.completed === false;
    return true;
  });

  filtered.forEach(t => {
    const li = document.createElement("li");
    li.className = t.completed ? "completed" : "";

    li.innerHTML = `
      <div class="task-left">
        <div class="check" onclick="toggleTask('${t._id}')">
          ${t.completed ? "✔" : ""}
        </div>
        <div>
          <span>${t.userTask}</span>
        </div>
      </div>
      <div>
        <button class="small-btn" onclick="editTask('${t._id}')">Edit</button>
        <button class="small-btn" onclick="deleteTask('${t._id}')">Delete</button>
      </div>
    `;

    list.appendChild(li);
  });

  updateCounter();
}


// COUNTER
function updateCounter() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed === true).length;
  const pending = total - completed;

  document.getElementById("counter").innerText =
    `Total: ${total} | Completed: ${completed} | Pending: ${pending}`;
}


// THEME
function toggleTheme() {
  document.body.classList.toggle("dark");
}


// CONFETTI
function checkAllCompleted() {
  if (tasks.length > 0 && tasks.every(t => t.completed)) {
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
  }
}
