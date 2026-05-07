"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabase"
import ProjectDetailsModal from "./ProjectDetailsModal"

const badgeConfig = {
  "Seeking Team": { label: "Seeking Team", dot: "#16a34a", bg: "#dcfce7", text: "#15803d", border: "#bbf7d0" },
  "Hiring": { label: "Hiring", dot: "#7c3aed", bg: "#ede9fe", text: "#6d28d9", border: "#ddd6fe" },
  "Idea Feedback": { label: "Idea Feedback", dot: "#d97706", bg: "#fef3c7", text: "#b45309", border: "#fde68a" },
}

const actionLabel = {
  "Seeking Team": "+ Join Team",
  "Hiring": "Apply / Send CV",
  "Idea Feedback": "💡 Give Insight",
}

export default function ProjectCard({ project, user }) { 
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(project.likes ?? 0)

  const authorName = project.users?.name || project.author_name || "Anonymous"
  const college = project.users?.college || project.college || "Student Developer"
  const badge = badgeConfig[project.type] || badgeConfig["Idea Feedback"]
  const initials = authorName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
            {initials}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 leading-tight">{authorName}</p>
            <p className="text-xs text-gray-400 mt-0.5">{college}</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border"
          style={{ background: badge.bg, color: badge.text, borderColor: badge.border }}>
          {badge.label}
        </span>
      </div>

      <h2 className="text-base font-bold text-gray-900 mb-1.5 leading-snug">{project.title}</h2>
      <p className="text-sm text-gray-500 leading-relaxed mb-3 line-clamp-2">{project.description}</p>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setLiked(!liked)} 
            className={`text-sm px-3 py-1.5 rounded-full border ${liked ? "bg-red-50 text-red-500" : "text-gray-400"}`}
          >
            {liked ? "♥" : "♡"} {liked ? likeCount + 1 : likeCount}
          </button>
        </div>
        <button 
          onClick={() => setIsDetailsOpen(true)} 
          className="text-sm px-4 py-1.5 rounded-full bg-purple-600 text-white font-medium"
        >
          {actionLabel[project.type] || "View Project"}
        </button>
      </div>

      {isDetailsOpen && (
        <ProjectDetailsModal 
          project={project} 
          user={user} 
          onClose={() => setIsDetailsOpen(false)} 
        />
      )}
    </div>
  )
}