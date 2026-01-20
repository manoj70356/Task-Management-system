import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import styles from "./Register.module.css";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", pass: "", confirm: "" });
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async () => {
    if (form.pass !== form.confirm) {
      setMessage({ text: "Passwords do not match", type: "error" });
      return;
    }

    try {
      const res = await api.post("register/", {
        username: form.name,
        email: form.email,
        password: form.pass,
      });

      setMessage({ text: res.data.msg, type: "success" });
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      if (err.response?.data?.error) {
        const error = err.response.data.error;
        const msg = typeof error === "object" ? Object.values(error).join(" ") : error;
        setMessage({ text: msg, type: "error" });
      } else {
        setMessage({ text: "Something went wrong", type: "error" });
      }
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h2 className={styles.title}>Create Account</h2>
        <p className={styles.subtitle}>Sign up to get started</p>

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
          <label>Full Name</label>
          <input name="name" placeholder="Enter your name" onChange={handleChange} />
        </div>

        <div className={styles.field}>
          <label>Email</label>
          <input name="email" placeholder="Enter your email" onChange={handleChange} />
        </div>

        <div className={styles.field}>
          <label>Password</label>
          <input name="pass" type="password" placeholder="Enter password" onChange={handleChange} />
        </div>

        <div className={styles.field}>
          <label>Confirm Password</label>
          <input name="confirm" type="password" placeholder="Confirm password" onChange={handleChange} />
        </div>

        <button className={styles.button} onClick={handleRegister}>
          Register
        </button>
        <p className={styles.textCenter}>
          I have an account{" "}
          <span onClick={() => navigate("/")} className={styles.linkButton}>
            Sign In
          </span>
      </p>
      </div>
    </div>
  );
}
