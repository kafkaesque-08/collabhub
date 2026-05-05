// components/ProjectCard.js
"use client"
import { useState } from "react"

const badgeStyles = {
  seeking_team:  "bg-green-100 text-green-700 border border-green-300",
  hiring:        "bg-purple-100 text-purple-700 border border-purple-300",
  idea_feedback: "bg-amber-100 text-amber-700 border border-amber-300",
}

const badgeLabels = {
  seeking_team:  "Seeking Team",
  hiring:        "Hiring",
  idea_feedback: "Idea Feedback",
}

export default function ProjectCard({ project }) {

  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(project.likes)
  const [matches, setMatches] = useState(null)
  const [matchLoading, setMatchLoading] = useState(false)

  function handleLike() {
    if (liked) { setLikeCount(likeCount - 1) }
    else { setLikeCount(likeCount + 1) }
    setLiked(!liked)
  }

  async function findMatches() {
    if (!project.tags || project.tags.length === 0) {
      alert("This project has no tags to match on!")
      return
    }
    setMatchLoading(true)
    try {
      const response = await fetch("http://localhost:8000/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skills: project.tags,
          project_type: project.type
        })
      })
      const data = await response.json()
      setMatches(data.matches)
    } catch (error) {
      alert("AI matcher is not available right now!")
    }
    setMatchLoading(false)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:border-purple-400 transition-all">

      {/* top row — author + badge */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-semibold">
            {(project.author_name || "?").split(" ").map(n => n[0]).join("")}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">{project.author_name}</p>
            <p className="text-xs text-gray-400">{project.college}</p>
          </div>
        </div>
        <span className={`text-xs px-3 py-1 rounded-full font-medium ${badgeStyles[project.type]}`}>
          {badgeLabels[project.type]}
        </span>
      </div>

      {/* project title */}
      <h2 className="text-base font-semibold text-gray-900 mb-1">{project.title}</h2>

      {/* description */}
      <p className="text-sm text-gray-500 leading-relaxed mb-3">{project.description}</p>

      {/* tech tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(project.tags || []).map((tag) => (
          <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-md">{tag}</span>
        ))}
      </div>

      {/* bottom row */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">

          {/* like button */}
          <button onClick={handleLike}
            className={`flex items-center gap-1 text-sm px-3 py-1 rounded-full border transition-all
              ${liked ? "bg-red-50 text-red-500 border-red-300" : "bg-white text-gray-400 border-gray-200 hover:border-red-300"}`}
          >
            {liked ? "♥" : "♡"} {likeCount}
          </button>

          {/* find teammates button */}
          <button onClick={findMatches} disabled={matchLoading}
            className="flex items-center gap-1 text-sm px-3 py-1 rounded-full border border-gray-200 bg-white text-gray-400 hover:border-purple-400 hover:text-purple-600 transition-all disabled:opacity-50"
          >
            {matchLoading ? "Finding..." : "🤝 Find Teammates"}
          </button>
        </div>

        {/* action button */}
        <button className="text-sm px-4 py-1.5 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-all">
          {project.type === "seeking_team" && "+ Join Team"}
          {project.type === "hiring" && "Apply / Send CV"}
          {project.type === "idea_feedback" && "💡 Give Insight"}
        </button>
      </div>

      {/* matches section */}
      {matches && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs font-medium text-gray-500 mb-2">
            Best matches for this project:
          </p>
          {matches.map((match, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                  {match.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-800">{match.name}</p>
                  <p className="text-xs text-gray-400">{match.college}</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-purple-600">
                {Math.round(match.match_score * 100)}% match
              </span>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}