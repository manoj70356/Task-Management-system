import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import styles from "./Login.module.css";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      setMessage({ text: "Please enter email and password", type: "error" });
      return;
    }

    try {
      const res = await api.post("login/", {
        email: form.email,
        password: form.password,
      });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      setMessage({ text: res.data.msg, type: "success" });
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      const msg =
        err.response?.data?.error || "Something went wrong. Try again!";
      setMessage({ text: msg, type: "error" });
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h2 className={styles.title}>Sign In</h2>
        <p className={styles.subtitle}>Login to your account</p>

        {message.text && (
          <div
            style={{
              textAlign: "center",
              marginBottom: "12px",
              color: message.type === "error" ? "red" : "green",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            {message.text}
          </div>
        )}

        <div className={styles.field}>
          <label>Email</label>
          <input
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className={styles.field}>
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <button className={styles.button} onClick={handleLogin}>
          Login
        </button>

        <p className={styles.text}>
          Don’t have an account?{" "}
          <span onClick={() => navigate("/register")} className={styles.link}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}
