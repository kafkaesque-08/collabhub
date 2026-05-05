"use client"
import { useState } from "react"
import { supabase } from "../lib/supabase"

export default function Navbar() {
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
    const tagsArray = form.tags.split(",").map(t => t.trim()).filter(t => t !== "")
    const { error } = await supabase.from('projects').insert([{
      title: form.title, description: form.description,
      tags: tagsArray, type: form.type,
      author_name: form.author_name, college: form.college,
    }])
    setLoading(false)
    if (error) { alert("Error: " + error.message); return }
    setSuccess(true)
    setTimeout(() => {
      setOpen(false); setSuccess(false)
      setForm({ title: "", description: "", tags: "", type: "seeking_team", author_name: "", college: "" })
      window.location.reload()
    }, 1500)
  }

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-xl font-bold">Collab<span className="text-purple-600">Hub</span></span>
          <div className="flex items-center gap-2">
            {["Feed", "Explore", "Network"].map((item) => (
              <button key={item} className="text-sm text-gray-500 hover:text-purple-600 px-3 py-1.5 rounded-full hover:bg-purple-50 transition-all">{item}</button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="text-sm bg-purple-600 text-white px-4 py-1.5 rounded-full hover:bg-purple-700 transition-all"
            >+ Share Idea</button>
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-semibold cursor-pointer">RK</div>
          </div>
        </div>
      </nav>

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
                { value: "hiring", label: "💼 Hiring" },
                { value: "idea_feedback", label: "💡 Feedback" },
              ].map((t) => (
                <button key={t.value} onClick={() => setForm({...form, type: t.value})}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-all ${form.type === t.value ? "bg-purple-600 text-white border-purple-600" : "bg-white text-gray-500 border-gray-200"}`}
                >{t.label}</button>
              ))}
            </div>
            {[
              { name: "title", placeholder: "Project title *" },
              { name: "author_name", placeholder: "Your name *" },
              { name: "college", placeholder: "Your college" },
              { name: "tags", placeholder: "Tech tags (React, Python, ML...)" },
            ].map((f) => (
              <input key={f.name} name={f.name} placeholder={f.placeholder}
                value={form[f.name]} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 outline-none focus:border-purple-400"
              />
            ))}
            <textarea name="description" placeholder="Describe your idea *"
              value={form.description} onChange={handleChange} rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 outline-none focus:border-purple-400 resize-none"
            />
            <button onClick={handleSubmit} disabled={loading || success}
              className="w-full py-2.5 rounded-xl bg-purple-600 text-white font-semibold text-sm hover:bg-purple-700 disabled:opacity-60 transition-all"
            >{success ? "✅ Posted!" : loading ? "Posting..." : "Post Project"}</button>
          </div>
        </div>
      )}
    </>
  )
}