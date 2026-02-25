import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [list, setList] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [dark, setDark] = useState(false);

  const API_URL = "https://todo-backend-0coe.onrender.com/todolist";

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((tasks) => setList(tasks));
  }, []);

  const addTask = () => {
    if (task === "") {
      return alert("Please enter a task");
    }

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userTask: task, completed: false }),
    })
      .then((res) => res.json())
      .then((newtask) => {
        setList([...list, newtask]);
        setTask("");
      });
  };

  const complete = (id, sts) => {
    fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !sts }),
    })
      .then((res) => res.json())
      .then((newvalue) => {
        const newList = list.map((ts) =>
          ts._id === id ? newvalue : ts
        );
        setList(newList);
      });
  };

  const deletee = (id) => {
    fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    }).then(() => {
      const newlist = list.filter((t) => t._id !== id);
      setList(newlist);
    });
  };

  // ✅ FILTER LOGIC
  const filteredTasks = list.filter((task) => {
    if (currentFilter === "completed") return task.completed === true;
    if (currentFilter === "pending") return task.completed === false;
    return true;
  });

  return (
    <div className={`app ${dark ? "dark" : ""}`}>
      <div className="top-bar">
        <h2>✨ Premium Todo</h2>
        <button
          className="theme-btn"
          onClick={() => setDark(!dark)}
        >
          🌙
        </button>
      </div>

      <div className="input-area">
        <input
          type="text"
          id="taskInput"
          placeholder="New task..."
          value={task}
          onChange={(event) => setTask(event.target.value)}
        />

        <button className="add-btn" onClick={addTask}>
          Add
        </button>

        <small
          id="errorMsg"
          style={{ color: "red", display: "none" }}
        >
          Please enter a task!
        </small>
      </div>

      <div className="filters">
        <button onClick={() => setCurrentFilter("all")}>All</button>
        <button onClick={() => setCurrentFilter("completed")}>Completed</button>
        <button onClick={() => setCurrentFilter("pending")}>Pending</button>
      </div>

      <ul id="taskList">
        {filteredTasks.map((task) => (
          <li
            key={task._id}
            className={task.completed ? "completed" : ""}
          >
            <div className="task-left">
              <div
                className="check"
                onClick={() =>
                  complete(task._id, task.completed)
                }
              >
                {task.completed ? "✔" : ""}
              </div>

              <div>
                <span>{task.userTask}</span>
              </div>
            </div>

            <div>
              <button
                className="small-btn"
                onClick={() => deletee(task._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="counter" id="counter"></div>
    </div>
  );
}

export default App;