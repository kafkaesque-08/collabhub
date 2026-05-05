"use client"
import { useState } from "react"
import { supabase } from "../lib/supabase"

export default function ShareIdeaButton() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    title: "", description: "", tags: "",
    type: "seeking_team", author_name: "", college: ""
  })

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit() {
    if (!form.title || !form.description || !form.author_name) {
      alert("Please fill in title, description and your name!")
      return
    }
    setLoading(true)
    const tagsArray = form.tags
      .split(",")
      .map(t => t.trim())
      .filter(t => t !== "")
    const { error } = await supabase
      .from('projects')
      .insert([{
        title:       form.title,
        description: form.description,
        tags:        tagsArray,
        type:        form.type,
        author_name: form.author_name,
        college:     form.college,
      }])
    setLoading(false)
    if (error) { alert("Error: " + error.message); return }
    setSuccess(true)
    setTimeout(() => {
      setOpen(false)
      setSuccess(false)
      window.location.reload()
    }, 1500)
  }

  async function extractTags() {
    if (!form.description) return
    try {
      const response = await fetch("http://localhost:8000/tags",{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: form.description })
      })
      const data = await response.json()
      if (data.tags && data.tags.length > 0) {
        setForm({ ...form, tags: data.tags.join(", ") })
      }
    } catch (error) {
      console.log("Tagger not available:",error)
    }
  }


  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full py-3 rounded-xl border-2 border-dashed border-purple-300 text-purple-500 hover:bg-purple-50 transition-all text-sm font-medium"
      >
        + Share your project idea
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">

            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-gray-800">Share your project idea</h2>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>

            <div className="flex gap-2 mb-4">
              {[
                { value: "seeking_team", label: "🚀 Seeking Team" },
                { value: "hiring",       label: "💼 Hiring" },
                { value: "idea_feedback", label: "💡 Feedback" },
              ].map((t) => (
                <button
                  key={t.value}
                  onClick={() => setForm({...form, type: t.value})}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-all
                    ${form.type === t.value
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-white text-gray-500 border-gray-200"
                    }`}
                >{t.label}</button>
              ))}
            </div>

            {[
              { name: "title",       placeholder: "Project title *" },
              { name: "author_name", placeholder: "Your name *" },
              { name: "college",     placeholder: "Your college" },
              { name: "tags",        placeholder: "Tech tags (React, Python, ML...)" },
            ].map((field) => (
              <input
                key={field.name}
                name={field.name}
                placeholder={field.placeholder}
                value={form[field.name]}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 outline-none focus:border-purple-400"
              />
            ))}
            <textarea
              name="description"
              placeholder="Describe your idea *"
              value={form.description}
              onChange={handleChange}
              onBlur={extractTags}
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 outline-none focus:border-purple-400 resize-none"
            />

            <button
              onClick={handleSubmit}
              disabled={loading || success}
              className="w-full py-2.5 rounded-xl bg-purple-600 text-white font-semibold text-sm hover:bg-purple-700 disabled:opacity-60 transition-all"
            >
              {success ? "✅ Posted!" : loading ? "Posting..." : "Post Project"}
            </button>
          </div>
        </div>
      )}
    </>
  )
}