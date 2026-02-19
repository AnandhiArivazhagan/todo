// let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
// let currentFilter = "all";

// function saveTasks(){
//   localStorage.setItem("tasks", JSON.stringify(tasks));
// }

// // function addTask(){
// //   const text = taskInput.value.trim();
// //   const due = dueDate.value;
// //   if(text==="") return;

// //   tasks.push({
// //     id: Date.now(),
// //     text,
// //     completed:false,
// //     due
// //   });

// //   taskInput.value="";
// //   dueDate.value="";
// //   saveTasks();
// //   render();
// // }

// function addTask() {
//   const input = document.getElementById("taskInput");
//   if (input.value.trim() === "") return;

//   const now = new Date();

//   const formattedDate = now.toLocaleString(); 
//   // Automatically current date + time

//   tasks.push({
//     text: input.value,
//     completed: false,
//     createdAt: formattedDate
//   });

//   input.value = "";
//   saveTasks();
//   renderTasks();
// }


// function toggleTask(id){
//   tasks = tasks.map(t =>
//     t.id===id ? {...t,completed:!t.completed} : t
//   );
//   saveTasks();
//   render();
//   checkAllCompleted();
// }

// function deleteTask(id){
//   tasks = tasks.filter(t=>t.id!==id);
//   saveTasks();
//   render();
// }

// function editTask(id){
//   const newText = prompt("Edit task:");
//   if(newText){
//     tasks = tasks.map(t =>
//       t.id===id ? {...t,text:newText} : t
//     );
//     saveTasks();
//     render();
//   }
// }

// function filterTasks(type){
//   currentFilter=type;
//   render();
// }

// function render(){
//   const list = document.getElementById("taskList");
//   list.innerHTML="";

//   let filtered = tasks.filter(t=>{
//     if(currentFilter==="completed") return t.completed;
//     if(currentFilter==="pending") return !t.completed;
//     return true;
//   });

//   filtered.forEach(t=>{
//     const li=document.createElement("li");
//     li.draggable=true;
//     li.ondragstart=e=>e.dataTransfer.setData("id",t.id);
//     li.ondragover=e=>e.preventDefault();
//     li.ondrop=e=>{
//       const draggedId=Number(e.dataTransfer.getData("id"));
//       reorder(draggedId,t.id);
//     };

//     li.className=t.completed?"completed":"";

//     li.innerHTML=`
//       <div class="task-left">
//         <div class="check" onclick="toggleTask(${t.id})">✔</div>
//         <div>
//           <span>${t.text}</span>
//           ${t.due?`<div class="due">⏰ ${new Date(t.due).toLocaleString()}</div>`:""}
//         </div>
//       </div>
//       <div>
//         <button class="small-btn" onclick="editTask(${t.id})">Edit</button>
//         <button class="small-btn" onclick="deleteTask(${t.id})">Delete</button>
//       </div>
//     `;
//     list.appendChild(li);
//   });

//   updateCounter();
// }

// function reorder(dragId,dropId){
//   const dragIndex=tasks.findIndex(t=>t.id===dragId);
//   const dropIndex=tasks.findIndex(t=>t.id===dropId);
//   const [removed]=tasks.splice(dragIndex,1);
//   tasks.splice(dropIndex,0,removed);
//   saveTasks();
//   render();
// }

// function updateCounter(){
//   const total=tasks.length;
//   const completed=tasks.filter(t=>t.completed).length;
//   const pending=total-completed;
//   counter.innerText=`Total: ${total} | Completed: ${completed} | Pending: ${pending}`;
// }

// function toggleTheme(){
//   document.body.classList.toggle("dark");
// }

// function checkAllCompleted(){
//   if(tasks.length>0 && tasks.every(t=>t.completed)){
//     confetti({particleCount:150,spread:70,origin:{y:0.6}});
//   }
// }

// render();



let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks(){
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const input = document.getElementById("taskInput");

  if (input.value.trim() === "") {
    alert("Please enter a task!");   // 🔥 ALERT POPUP
    return;
  }

  const now = new Date();

  tasks.push({
    id: Date.now(),
    text: input.value.trim(),
    completed: false,
    createdAt: now.toLocaleString()
  });

  input.value = "";
  saveTasks();
  render();
}



function toggleTask(id){
  tasks = tasks.map(t =>
    t.id===id ? {...t,completed:!t.completed} : t
  );
  saveTasks();
  render();
  checkAllCompleted();
}

function deleteTask(id){
  tasks = tasks.filter(t=>t.id!==id);
  saveTasks();
  render();
}

function editTask(id){
  const newText = prompt("Edit task:");
  if(newText){
    tasks = tasks.map(t =>
      t.id===id ? {...t,text:newText} : t
    );
    saveTasks();
    render();
  }
}

function filterTasks(type){
  currentFilter=type;
  render();
}

function render(){
  const list = document.getElementById("taskList");
  list.innerHTML="";

  let filtered = tasks.filter(t=>{
    if(currentFilter==="completed") return t.completed;
    if(currentFilter==="pending") return !t.completed;
    return true;
  });

  filtered.forEach(t=>{
    const li=document.createElement("li");
    li.draggable=true;

    li.ondragstart=e=>e.dataTransfer.setData("id",t.id);
    li.ondragover=e=>e.preventDefault();
    li.ondrop=e=>{
      const draggedId=Number(e.dataTransfer.getData("id"));
      reorder(draggedId,t.id);
    };

    li.className=t.completed?"completed":"";

    li.innerHTML=`
      <div class="task-left">
        <div class="check" onclick="toggleTask(${t.id})">✔</div>
        <div>
          <span>${t.text}</span>
          <div class="due">📅 ${t.createdAt}</div> <!-- ✅ SHOW AUTO DATE -->
        </div>
      </div>
      <div>
        <button class="small-btn" onclick="editTask(${t.id})">Edit</button>
        <button class="small-btn" onclick="deleteTask(${t.id})">Delete</button>
      </div>
    `;

    list.appendChild(li);
  });

  updateCounter();
}

function reorder(dragId,dropId){
  const dragIndex=tasks.findIndex(t=>t.id===dragId);
  const dropIndex=tasks.findIndex(t=>t.id===dropId);
  const [removed]=tasks.splice(dragIndex,1);
  tasks.splice(dropIndex,0,removed);
  saveTasks();
  render();
}

function updateCounter(){
  const total=tasks.length;
  const completed=tasks.filter(t=>t.completed).length;
  const pending=total-completed;
  document.getElementById("counter").innerText=
    `Total: ${total} | Completed: ${completed} | Pending: ${pending}`;
}

function toggleTheme(){
  document.body.classList.toggle("dark");
}

function checkAllCompleted(){
  if(tasks.length>0 && tasks.every(t=>t.completed)){
    confetti({particleCount:150,spread:70,origin:{y:0.6}});
  }
}

render();
