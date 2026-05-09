"use client"
import { useState } from "react"
import { supabase } from "../lib/supabase" 

const TYPE_OPTIONS = [
  { value: "Seeking Team",  label: "Seeking Team",   desc: "Looking for teammates", color: "#16a34a", bg: "#dcfce7" },
  { value: "Hiring",         label: "Hiring",         desc: "Paid role or internship", color: "#7c3aed", bg: "#ede9fe" },
  { value: "Idea Feedback", label: "Idea Feedback",  desc: "Want feedback on an idea", color: "#d97706", bg: "#fef3c7" },
]

export default function ShareIdeaModal({ user, profile, onClose, onPosted }) {
  const [type, setType] = useState("Seeking Team")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [githubUrl, setGithubUrl] = useState("") 
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState("")
  const [tagsLoading, setTagsLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const authorName = profile?.name || user?.email?.split("@")[0] || "Anonymous"
  const college = profile?.college || ""
  const initials = authorName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)

  async function autoTag() {
    if (!description.trim()) return
    setTagsLoading(true)
    try {
      
      const apiUrl = process.env.NEXT_PUBLIC_AI_API_URL || "http://localhost:8000/tags"
      
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      })
      const data = await res.json()
      
      if (data.tags?.length > 0) {
        
        setTags(prev => [...new Set([...prev, ...data.tags])])
      }
    } catch (err) {
      console.error("AI Tagging unavailable:", err)
    } finally {
      setTagsLoading(false)
    }
  }

  function addTag(e) {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault()
      const newTag = tagInput.trim().replace(",", "")
      if (!tags.includes(newTag)) setTags([...tags, newTag])
      setTagInput("")
    }
  }

  function removeTag(tag) {
    setTags(tags.filter(t => t !== tag))
  }

  async function handleSubmit() {
    if (!title.trim() || !description.trim()) {
      setError("Please fill in the title and description.")
      return
    }
    if (!user) {
      setError("Session expired. Please sign in again.")
      return
    }
    
    setSubmitting(true)
    setError("")

  
    const { data, error: dbError } = await supabase
      .from("projects")
      .insert({
        title: title.trim(),
        description: description.trim(),
        type: type, 
        tags: tags,
        github_url: githubUrl.trim(), 
        user_id: user.id, 
        author_name: authorName,
        college: college,
        likes: 0,
      })
      .select()
      .single()

    if (dbError) {
      
      setError(dbError.message)
      setSubmitting(false)
      return
    }

    onPosted(data)
    onClose()
    setSubmitting(false)
  }

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(2px)",
        }}
      />

      <div style={{
        position: "fixed", zIndex: 101,
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "min(520px, 94vw)",
        maxHeight: "90vh",
        overflowY: "auto",
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
        fontFamily: "'DM Sans', sans-serif",
      }}>

        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "18px 20px 14px",
          borderBottom: "1px solid #f3f4f6",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 13, fontWeight: 700,
            }}>
              {initials}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#111827" }}>{authorName}</p>
              {college && <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>{college}</p>}
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "none", border: "none", fontSize: 20,
            color: "#9ca3af", cursor: "pointer", lineHeight: 1,
          }}>×</button>
        </div>

        <div style={{ padding: "16px 20px 20px" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px" }}>
            Post Type
          </p>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {TYPE_OPTIONS.map(opt => (
              <button key={opt.value} onClick={() => setType(opt.value)}
                style={{
                  flex: 1, padding: "8px 6px", borderRadius: 10,
                  border: type === opt.value ? `2px solid ${opt.color}` : "2px solid #e5e7eb",
                  background: type === opt.value ? opt.bg : "#f9fafb",
                  cursor: "pointer", transition: "all 0.15s",
                  textAlign: "center",
                }}>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: type === opt.value ? opt.color : "#6b7280" }}>
                  {opt.label}
                </p>
              </button>
            ))}
          </div>

          <label style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Project Title
          </label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. AI-powered study planner"
            style={{
              display: "block", width: "100%", marginTop: 6, marginBottom: 14,
              padding: "9px 12px", borderRadius: 10,
              border: "1.5px solid #e5e7eb", fontSize: 14,
              color: "#111827", outline: "none", boxSizing: "border-box",
            }}
          />

          <label style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Description
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe your project..."
            rows={4}
            style={{
              display: "block", width: "100%", marginTop: 6, marginBottom: 4,
              padding: "9px 12px", borderRadius: 10,
              border: "1.5px solid #e5e7eb", fontSize: 13,
              color: "#374151", outline: "none", resize: "vertical",
              lineHeight: 1.6, boxSizing: "border-box",
              fontFamily: "'DM Sans', sans-serif",
            }}
            onBlur={autoTag}
          />
          <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 14px" }}>
            {tagsLoading ? "✦ Auto-detecting tags…" : "Tags auto-detect when you finish typing"}
          </p>

          <label style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Tags
          </label>
          <div style={{
            marginTop: 6, padding: "8px 10px", marginBottom: 14,
            border: "1.5px solid #e5e7eb", borderRadius: 10,
            display: "flex", flexWrap: "wrap", gap: 6,
            minHeight: 44,
          }}>
            {tags.map(tag => (
              <span key={tag} style={{
                display: "flex", alignItems: "center", gap: 4,
                fontSize: 12, padding: "3px 10px", borderRadius: 20,
                background: "#eef2ff", color: "#6366f1", fontWeight: 600,
              }}>
                {tag}
                <button onClick={() => removeTag(tag)} style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "#a5b4fc", fontSize: 14, lineHeight: 1, padding: 0,
                }}>×</button>
              </span>
            ))}
            <input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={addTag}
              placeholder={tags.length === 0 ? "Type a tag and press Enter…" : ""}
              style={{
                border: "none", outline: "none", fontSize: 12,
                color: "#374151", flex: 1, minWidth: 120,
                fontFamily: "'DM Sans', sans-serif",
              }}
            />
          </div>

          <label style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            GitHub Repository (Optional)
          </label>
          <div style={{ position: "relative", marginTop: 6, marginBottom: 14 }}>
            <span style={{ position: "absolute", left: 10, top: 9, color: "#9ca3af" }}>
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.416-4.041-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </span>
            <input
              type="url"
              value={githubUrl}
              onChange={e => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username/repo"
              style={{
                display: "block", width: "100%",
                padding: "9px 12px 9px 36px", borderRadius: 10,
                border: "1.5px solid #e5e7eb", fontSize: 13,
                color: "#111827", outline: "none", boxSizing: "border-box",
              }}
            />
          </div>

          {error && (
            <p style={{ marginTop: 10, fontSize: 13, color: "#ef4444", background: "#fee2e2", padding: "8px", borderRadius: "6px" }}>
              ⚠️ {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              marginTop: 6, width: "100%",
              padding: "11px 0", borderRadius: 10,
              background: submitting ? "#a5b4fc" : "#6366f1",
              border: "none", color: "#fff",
              fontSize: 14, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer",
              transition: "background 0.15s",
            }}>
            {submitting ? "Posting…" : "Post Project"}
          </button>
        </div>
      </div>
    </>
  )
}