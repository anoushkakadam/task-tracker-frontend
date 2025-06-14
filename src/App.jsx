import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    axios.get(`${API}/tasks`)
      .then(res => setTasks(res.data))
      .catch(err => console.error("Fetch error:", err));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    axios.post(`${API}/tasks`, {
      title: newTitle,
      description: newDesc,
    })
    .then(res => {
      setTasks([...tasks, res.data]);
      setNewTitle('');
      setNewDesc('');
    })
    .catch(err => console.error("Add error:", err));
  };

  const nextStatus = (status) => {
    if (status === "To Do") return "In Progress";
    if (status === "In Progress") return "Done";
    return "To Do";
  };

  const statusEmoji = (status) => {
    if (status === "To Do") return "🟡";
    if (status === "In Progress") return "🟠";
    if (status === "Done") return "🟢";
    return "";
  };

  const updateStatus = (id, newStatus) => {
    axios.put(`${API}/tasks/${id}`, { status: newStatus })
      .then(res => {
        setTasks(tasks.map(t => t._id === id ? res.data : t));
      })
      .catch(err => console.error("Update error:", err));
  };

  const deleteTask = (id) => {
    axios.delete(`${API}/tasks/${id}`)
      .then(() => setTasks(tasks.filter(t => t._id !== id)))
      .catch(err => console.error("Delete error:", err));
  };

  return (
    <div className="app-container">
      <div className="doodle">
        <img src="https://cdn-icons-png.flaticon.com/512/3649/3649465.png" alt="cute doodle" width="80" />
      </div>

      <h1>🌸 My Task Tracker 🌸</h1>

      <form className="task-form" onSubmit={handleAddTask}>
        <input
          placeholder="Task title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={newDesc}
          onChange={(e) => setNewDesc(e.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>

      <div className="filter-buttons">
        {["All", "To Do", "In Progress", "Done"].map(status => (
          <button
            type="button"
            key={status}
            onClick={() => setFilter(status)}
          >
            {statusEmoji(status)} {status}
          </button>
        ))}
      </div>

      <ul>
        {tasks
          .filter(task => filter === "All" || task.status === filter)
          .map(task => (
            <li key={task._id} className="task-card">
              <strong>{task.title}</strong> <em>({statusEmoji(task.status)} {task.status})</em>
              <p>{task.description}</p>
              <button
                type="button"
                onClick={() => updateStatus(task._id, nextStatus(task.status))}
              >
                Mark as {nextStatus(task.status)}
              </button>
              <button
                type="button"
                onClick={() => deleteTask(task._id)}
                style={{ backgroundColor: '#ff6b6b' }}
              >
                Delete
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default App;
