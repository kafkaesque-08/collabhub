"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function ApplicationModal({ project, user, onClose }) {
  const [message, setMessage] = useState("")
  const [file, setFile] = useState(null)
  const [sending, setSending] = useState(false)

  const handleSubmit = async () => {
    console.log("Submit button clicked!"); 
    if (!user) return alert("Please log in to apply.")
    setSending(true)

    try {
      let cvUrl = ""

   
      if (file) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}-${Math.random()}.${fileExt}`
        
    
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('cv_bucket') 
          .upload(fileName, file)

        if (uploadError) throw uploadError

        
        const { data: { publicUrl } } = supabase.storage
          .from('cv_bucket')
          .getPublicUrl(fileName)
        
        cvUrl = publicUrl 
        
      }


      const { error } = await supabase
        .from("applications")
        .insert([
          {
            project_id: project.id,
            applicant_id: user.id,
            message: message,
            cv_url: cvUrl, 
            status: "pending",
            name: user.user_metadata?.full_name || user.email.split('@')[0],
            email: user.email
          }
        ])

      if (error) throw error

      alert("Application & CV sent successfully! 🚀")
      onClose()
    } catch (err) {
      console.error("Submission error:", err.message);
      alert(`Error: ${err.message}`)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl text-black">
        <h2 className="text-2xl font-bold mb-4">Apply for {project.title}</h2>
        
        <textarea
          className="w-full border border-gray-200 rounded-xl p-4 h-32 mb-4 outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Tell them why you're a fit..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-500 mb-2 uppercase">Attach CV (PDF)</label>
          <input 
            type="file" 
            accept=".pdf,.doc,.docx"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
          />
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 text-gray-400 font-bold">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={sending}
            className="flex-[2] py-3 bg-purple-600 text-white rounded-xl font-bold disabled:opacity-50 hover:bg-purple-700 transition-all"
          >
            {sending ? "Uploading..." : "Submit Application"}
          </button>
        </div>
      </div>
    </div>
  )
}