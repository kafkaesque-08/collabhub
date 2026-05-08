// app/signup/page.js
"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"

export default function SignupPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  const router = useRouter()
  const [form, setForm] = useState({
    full_name: "", email: "", college: "", year: "", password: ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function set(field) {
    return e => setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSignup() {
    if (!form.full_name || !form.email || !form.password) {
      setError("Please fill in your name, email, and password."); return
    }
    setLoading(true); setError("")

    // 1. Create auth user
    const { data, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    })
    if (authError) { setError(authError.message); setLoading(false); return }

    // 2. Insert profile into users table, linked to auth user id
    const userId = data.user?.id
    if (userId) {
      await supabase.from("users").insert({
        id: userId,
        full_name: form.full_name,
        email: form.email,
        college: form.college,
        year: form.year ? parseInt(form.year) : null,
        skills: [],
        project_count: 0,
        teams_joined: 0,
        profile_views: 0,
      })
    }

    router.push("/")
    router.refresh()
  }

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>
      <div style={{
        minHeight: "100vh", display: "flex",
        background: "linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #faf5ff 100%)",
        fontFamily: "'DM Sans', sans-serif",
        alignItems: "center", justifyContent: "center",
        padding: 20,
      }}>
        <div style={{
          width: "100%", maxWidth: 420,
          background: "#fff", borderRadius: 20,
          border: "1px solid #e5e7eb",
          boxShadow: "0 8px 40px rgba(99,102,241,0.10)",
          padding: "36px 32px",
        }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, color: "#1a1a2e" }}>
              Collab<span style={{ color: "#6366f1" }}>Hub</span>
            </span>
            <p style={{ fontSize: 14, color: "#6b7280", marginTop: 6 }}>
              Join thousands of student developers
            </p>
          </div>

          {[
            { field: "full_name", label: "Full Name", placeholder: "Ananya Mehta", type: "text" },
            { field: "email",     label: "Email",     placeholder: "you@college.edu", type: "email" },
            { field: "college",   label: "College",   placeholder: "IIT Delhi, BITS Pilani…", type: "text" },
          ].map(({ field, label, placeholder, type }) => (
            <div key={field}>
              <label style={labelStyle}>{label}</label>
              <input
                type={type}
                value={form[field]}
                onChange={set(field)}
                placeholder={placeholder}
                style={{ ...inputStyle, marginBottom: 14 }}
                onFocus={e => e.target.style.borderColor = "#6366f1"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"}
              />
            </div>
          ))}

          <label style={labelStyle}>Year of Study</label>
          <select value={form.year} onChange={set("year")} style={{ ...inputStyle, marginBottom: 14 }}>
            <option value="">Select year…</option>
            {[1,2,3,4,"Masters","PhD"].map(y => (
              <option key={y} value={y}>Year {y}</option>
            ))}
          </select>

          <label style={labelStyle}>Password</label>
          <input
            type="password" value={form.password}
            onChange={set("password")}
            placeholder="Min 6 characters"
            style={{ ...inputStyle, marginBottom: 6 }}
            onKeyDown={e => e.key === "Enter" && handleSignup()}
            onFocus={e => e.target.style.borderColor = "#6366f1"}
            onBlur={e => e.target.style.borderColor = "#e5e7eb"}
          />

          {error && <p style={{ fontSize: 13, color: "#ef4444", marginTop: 10 }}>{error}</p>}

          <button onClick={handleSignup} disabled={loading} style={{
            marginTop: 18, width: "100%",
            padding: "12px 0", borderRadius: 10,
            background: loading ? "#a5b4fc" : "#6366f1",
            border: "none", color: "#fff",
            fontSize: 14, fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
          }}>
            {loading ? "Creating account…" : "Create Account"}
          </button>

          <p style={{ textAlign: "center", fontSize: 13, color: "#6b7280", marginTop: 18 }}>
            Already have an account?{" "}
            <a href="/login" style={{ color: "#6366f1", fontWeight: 600, textDecoration: "none" }}>
              Sign In
            </a>
          </p>
        </div>
      </div>
    </>
  )
}

const labelStyle = {
  display: "block", fontSize: 12, fontWeight: 700,
  color: "#6b7280", textTransform: "uppercase",
  letterSpacing: "0.05em", marginBottom: 6,
}

const inputStyle = {
  display: "block", width: "100%", boxSizing: "border-box",
  padding: "10px 12px", borderRadius: 10,
  border: "1.5px solid #e5e7eb", fontSize: 14,
  color: "#111827", outline: "none",
  fontFamily: "'DM Sans', sans-serif",
  transition: "border-color 0.15s",
  background: "#fff",
}