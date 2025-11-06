// app/signup/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "investor" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed");
        setLoading(false);
        return;
      }

      // On success, token cookie is set by server.
      // You can redirect to dashboard now.
      if (data.user.role === "analyst") {
        router.push("/dashboard/analyst");
      } else {
        router.push("/dashboard/investor");
      }
    } catch (err) {
      console.error(err);
      setError("Network error - try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "3rem auto", padding: "1.5rem", border: "1px solid #eee", borderRadius: 8 }}>
      <h1 style={{ marginBottom: 12 }}>Create account</h1>

      <form onSubmit={handleSubmit}>
        <label style={{ display: "block", marginBottom: 8 }}>
          Name
          <input name="name" required value={form.name} onChange={handleChange} style={{ width: "100%", padding: 8, marginTop: 6 }} />
        </label>

        <label style={{ display: "block", marginBottom: 8 }}>
          Email
          <input name="email" type="email" required value={form.email} onChange={handleChange} style={{ width: "100%", padding: 8, marginTop: 6 }} />
        </label>

        <label style={{ display: "block", marginBottom: 8 }}>
          Password
          <input name="password" type="password" required value={form.password} onChange={handleChange} style={{ width: "100%", padding: 8, marginTop: 6 }} />
        </label>

        <label style={{ display: "block", marginBottom: 16 }}>
          Role
          <select name="role" value={form.role} onChange={handleChange} style={{ width: "100%", padding: 8, marginTop: 6 }}>
            <option value="investor">Investor</option>
            <option value="analyst">Analyst</option>
          </select>
        </label>

        {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}

        <button type="submit" disabled={loading} style={{ padding: "10px 16px" }}>
          {loading ? "Creating..." : "Sign up"}
        </button>
      </form>
    </div>
  );
}
