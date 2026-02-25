import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [list, setList] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [dark, setDark] = useState(false);

  const API_URL = "https://todo-backend-0coe.onrender.com/todolist";

  // LOAD TASKS
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setList(data));
  }, []);

  // ✅ THEME EFFECT
  useEffect(() => {
    document.body.classList.toggle("dark", dark);
  }, [dark]);

  // ADD TASK
  const addTask = () => {
    if (task.trim() === "") {
      alert("Please enter a task!");
      return;
    }

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userTask: task.trim(),
        completed: false,
      }),
    })
      .then((res) => res.json())
      .then((newTask) => {
        setList((prev) => [...prev, newTask]);
        setTask("");
      });
  };

  // TOGGLE COMPLETE
  const toggleTask = (id) => {
    const selected = list.find((t) => t._id === id);

    fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !selected.completed }),
    })
      .then((res) => res.json())
      .then((updatedTask) => {
        setList((prev) =>
          prev.map((t) => (t._id === id ? updatedTask : t))
        );
      });
  };

  // DELETE TASK
  const deleteTask = (id) => {
    fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    }).then(() => {
      setList((prev) => prev.filter((t) => t._id !== id));
    });
  };

  // EDIT TASK
  const editTask = (id) => {
    const newText = prompt("Edit task:");
    if (!newText || newText.trim() === "") return;

    fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userTask: newText.trim() }),
    })
      .then((res) => res.json())
      .then((updatedTask) => {
        setList((prev) =>
          prev.map((t) => (t._id === id ? updatedTask : t))
        );
      });
  };

  // FILTER
  const filteredTasks = list.filter((t) => {
    if (currentFilter === "completed") return t.completed;
    if (currentFilter === "pending") return !t.completed;
    return true;
  });

  // COUNTER
  const total = list.length;
  const completed = list.filter((t) => t.completed).length;
  const pending = total - completed;

  return (
    <div className="app">
      <div className="top-bar">
        <h2>✨ Premium Todo</h2>
        <button
          className="theme-btn"
          onClick={() => setDark((prev) => !prev)}
        >
          🌙
        </button>
      </div>

      <div className="input-area">
        <input
          type="text"
          placeholder="New task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />

        <button className="add-btn" onClick={addTask}>
          Add
        </button>
      </div>

      <div className="filters">
        <button onClick={() => setCurrentFilter("all")}>All</button>
        <button onClick={() => setCurrentFilter("completed")}>
          Completed
        </button>
        <button onClick={() => setCurrentFilter("pending")}>
          Pending
        </button>
      </div>

      <ul className="taskList">
        {filteredTasks.map((t) => (
          <li key={t._id} className={t.completed ? "completed" : ""}>
            <div className="task-left">
              <div
                className="check"
                onClick={() => toggleTask(t._id)}
              >
                {t.completed ? "✔" : ""}
              </div>
              <span>{t.userTask}</span>
            </div>

            <div className="task-actions">
              <button
                className="small-btn"
                onClick={() => editTask(t._id)}
              >
                Edit
              </button>
              <button
                className="small-btn"
                onClick={() => deleteTask(t._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="counter">
        Total: {total} | Completed: {completed} | Pending: {pending}
      </div>
    </div>
  );
}

export default App;