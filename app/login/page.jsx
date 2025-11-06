"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await axios.post("/api/login", form);
      const role = data.user.role || "blabla";
      console.log(role);
      // ✅ manual rerouting based on role
      if (role === "analyst") router.push("/dashboard/analyst");
      else router.push("/dashboard/investor");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 480,
        margin: "3rem auto",
        padding: "1.5rem",
        border: "1px solid #eee",
        borderRadius: 8,
        background: "#fff",
      }}
    >
      <h1 style={{ marginBottom: 12, textAlign: "center" }}>Login</h1>

      <form onSubmit={handleSubmit}>
        <label style={{ display: "block", marginBottom: 8 }}>
          Email
          <input
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: 8,
              marginTop: 6,
              borderRadius: 6,
              border: "1px solid #ccc",
            }}
          />
        </label>

        <label style={{ display: "block", marginBottom: 16 }}>
          Password
          <input
            name="password"
            type="password"
            required
            value={form.password}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: 8,
              marginTop: 6,
              borderRadius: 6,
              border: "1px solid #ccc",
            }}
          />
        </label>

        {error && (
          <div style={{ color: "red", marginBottom: 12, textAlign: "center" }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 16px",
            width: "100%",
            backgroundColor: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* 🆕 Add Signup Section */}
      <div
        style={{
          marginTop: 20,
          textAlign: "center",
          fontSize: "0.9rem",
          color: "#555",
        }}
      >
        Don’t have an account?{" "}
        <span
          style={{
            color: "#0070f3",
            textDecoration: "underline",
            cursor: "pointer",
          }}
          onClick={() => router.push("/signup")}
        >
          Sign up here
        </span>
      </div>
    </div>
  );
}
