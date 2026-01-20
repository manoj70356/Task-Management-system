import React, { useState, useEffect } from "react";
import styles from "./Dashboard.module.css";
import TaskDetail from "./TaskDetail";
import api from "../api";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    due_date: "",
    status: "Pending",
  });
  const [user, setUser] = useState({ username: "" });

  // Fetch logged-in user
  const fetchUser = async () => {
    try {
      const res = await api.get("user/");
      setUser(res.data);
    } catch (err) {
      console.error("Fetch User Error:", err);
    }
  };

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const res = await api.get("tasks/");
      setTasks(res.data);
    } catch (err) {
      console.error("Fetch Tasks Error:", err);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchTasks();
  }, []);

  // Add new task
  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("tasks/", newTask);
      setTasks([res.data, ...tasks]); 
      setNewTask({ title: "", description: "", due_date: "", status: "Pending" });
      setShowAddForm(false);
    } catch (err) {
      console.error("Add Task Error:", err);
    }
  };

  // Delete task
  const handleDeleteTask = async (id) => {
    try {
      await api.delete(`tasks/${id}/`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      console.error("Delete Task Error:", err);
    }
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <h2 className={styles.logo}>{user.username || "User"}</h2>
        <ul className={styles.nav}>
          <li>Dashboard</li>
          <li>Tasks</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        <header className={styles.header}>
          <h1>Dashboard</h1>
        </header>

        {/* Add Task */}
        <div className={styles.addTaskSection}>
          {!showAddForm && (
            <button className={styles.addButton} onClick={() => setShowAddForm(true)}>
              Add Task
            </button>
          )}
          {showAddForm && (
            <section className={styles.addTaskForm}>
              <form onSubmit={handleAddTask}>
                <div className={styles.inputRow}>
                  <input
                    type="text"
                    placeholder="Task Title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  />
                  <select
                    value={newTask.status}
                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <input
                    type="date"
                    value={newTask.due_date}
                    onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                  />
                </div>

                <div className={styles.formButtons}>
                  <button type="submit">Submit</button>
                  <button type="button" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </section>
          )}
        </div>

        {/* Tasks Table */}
        <section className={styles.tasksSection}>
          <h3>All Tasks</h3>
          <table className={styles.tasksTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Task</th>
                <th>Status</th>
                <th>Created By</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr
                  key={task.id}
                  onClick={() => setSelectedTask(task)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{task.id}</td>
                  <td>{task.title}</td>
                  <td>{task.status}</td>
                  <td>{task.created_by}</td>
                  <td>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTask(task.id);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Task Detail Modal */}
        {selectedTask && (
          <TaskDetail
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onUpdate={(updatedTask) => {
              setTasks((prevTasks) =>
                prevTasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
              );
              setSelectedTask(updatedTask);
            }}
          />
        )}
      </main>
    </div>
  );
}
