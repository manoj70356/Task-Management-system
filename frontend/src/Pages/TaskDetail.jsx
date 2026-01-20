import React, { useState } from "react";
import styles from "./TaskDetail.module.css";
import api from "../api";

export default function TaskDetail({ task, onClose, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description,
    status: task.status,
    due_date: task.due_date,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!task) return null;

  const statusClass =
    task.status === "Pending"
      ? styles.statusPending
      : task.status === "In Progress"
      ? styles.statusInProgress
      : styles.statusCompleted;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.put(`tasks/${task.id}/`, editData);
      onUpdate(response.data);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setError("Failed to save changes.");
    }
    setLoading(false);
  };

  return (
    <div className={styles.fullTaskView}>
      <div className={styles.taskCard}>
        <button className={styles.closeBtn} onClick={onClose}>
          &times;
        </button>

        <div className={styles.taskHeader}>
          <h2>Task Details</h2>
          <button
            className={styles.editBtn}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel" : "Edit Task"}
          </button>
        </div>

        <div className={styles.taskInfo}>
          <div className={styles.infoRow}>
            <span>ID:</span> {task.id}
          </div>
          <div className={styles.infoRow}>
            <span>Title:</span>{" "}
            {isEditing ? (
              <input
                type="text"
                name="title"
                value={editData.title}
                onChange={handleChange}
              />
            ) : (
              task.title
            )}
          </div>
          <div className={styles.infoRow}>
            <span>Description:</span>{" "}
            {isEditing ? (
              <textarea
                name="description"
                value={editData.description}
                onChange={handleChange}
              />
            ) : (
              task.description
            )}
          </div>
          <div className={styles.infoRow}>
            <span>Status:</span>{" "}
            {isEditing ? (
              <select
                name="status"
                value={editData.status}
                onChange={handleChange}
              >
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            ) : (
              <span className={`${styles.statusBadge} ${statusClass}`}>
                {task.status}
              </span>
            )}
          </div>
          <div className={styles.infoRow}>
            <span>Due Date:</span>{" "}
            {isEditing ? (
              <input
                type="date"
                name="due_date"
                value={editData.due_date}
                onChange={handleChange}
              />
            ) : (
              task.due_date
            )}
          </div>
          <div className={styles.infoRow}>
            <span>Created At:</span>{" "}
            {new Date(task.created_at).toLocaleString()}
          </div>
          <div className={styles.infoRow}>
            <span>Updated At:</span>{" "}
            {new Date(task.updated_at).toLocaleString()}
          </div>
          <div className={styles.infoRow}>
            <span>Created By:</span> {task.created_by}
          </div>
        </div>

        {isEditing && (
          <>
            {error && <div style={{ color: "red" }}>{error}</div>}
            <button
              className={styles.saveBtn}
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
