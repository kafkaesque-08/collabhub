"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase" 
import ProjectCard from "@/components/ProjectCard"
import ShareIdeaModal from "@/components/ShareIdeaModal"
import LeftSidebar from "@/components/LeftSidebar"
import RightSidebar from "@/components/RightSidebar"

const FILTERS = ["All", "Seeking Team", "Hiring", "Idea Feedback"]
const filterMap = {
  "All": null,
  "Seeking Team": "Seeking Team",
  "Hiring": "Hiring",
  "Idea Feedback": "Idea Feedback",
}

export default function FeedPage() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [projects, setProjects] = useState([])
  const [filter, setFilter] = useState("All")
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      // Fetch initial user
      const { data: { user: activeUser } } = await supabase.auth.getUser()
      setUser(activeUser)
      
      if (activeUser) {
        const { data } = await supabase
          .from("users")
          .select("*")
          .eq("id", activeUser.id)
          .single()
        setProfile(data)
      }
      await fetchProjects()
      setLoading(false)
    }
    init()

    // Listen for login/logout changes to prevent instance warnings
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    
    return () => authListener.subscription.unsubscribe()
  }, [])

  async function fetchProjects(type = null) {
    let query = supabase
      .from("projects")
      .select(`
        *,
        users (
          name,
          college
        )
      `)
      .order("created_at", { ascending: false })
    
    if (type) query = query.eq("type", type)
    
    const { data, error } = await query
    if (error) {
      console.error("Error fetching projects:", error.message)
    } else {
      setProjects(data || [])
    }
  }

  function handleFilterChange(f) {
    setFilter(f)
    fetchProjects(filterMap[f])
  }

  function onProjectPosted(newProject) {
    const projectWithUser = {
        ...newProject,
        users: {
            name: profile?.name,
            college: profile?.college
        }
    }
    setProjects(prev => [projectWithUser, ...prev])
    setModalOpen(false)
  }

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>

      <div style={{ minHeight: "100vh", background: "#f3f2ef", fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{
          maxWidth: 1128, margin: "0 auto", padding: "20px 16px",
          display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,2fr) minmax(0,1fr)",
          gap: 20, alignItems: "start",
        }}>

          <aside>
            <LeftSidebar user={user} profile={profile} />
          </aside>

          <main>
            {user && (
              <div style={{
                background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb",
                padding: "14px 16px", marginBottom: 14, display: "flex", alignItems: "center", gap: 12,
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontSize: 14, fontWeight: 700,
                }}>
                  {(profile?.name || user.email || "U").charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={() => setModalOpen(true)}
                  style={{
                    flex: 1, textAlign: "left", padding: "9px 14px", borderRadius: 24,
                    border: "1px solid #e5e7eb", background: "#f9fafb", color: "#9ca3af",
                    fontSize: 13, cursor: "pointer",
                  }}>
                  Share a project idea…
                </button>
              </div>
            )}

            <div style={{ display: "flex", gap: 8, marginBottom: 14, overflowX: "auto" }}>
              {FILTERS.map(f => (
                <button key={f} onClick={() => handleFilterChange(f)}
                  style={{
                    padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 500,
                    border: filter === f ? "1.5px solid #6366f1" : "1.5px solid #e5e7eb",
                    background: filter === f ? "#eef2ff" : "#fff",
                    color: filter === f ? "#6366f1" : "#6b7280",
                  }}>
                  {f}
                </button>
              ))}
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: 60, color: "#9ca3af" }}>Loading projects…</div>
            ) : projects.length === 0 ? (
              <div style={{ textAlign: "center", padding: 60, background: "#fff", borderRadius: 12, color: "#9ca3af" }}>
                No projects yet. 🚀
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {projects.map(p => (
                  <ProjectCard 
                    key={p.id} 
                    project={p} 
                    user={user} // Passing the user prop correctly
                  />
                ))}
              </div>
            )}
          </main>

          <aside>
            <RightSidebar />
          </aside>
        </div>
      </div>

      {modalOpen && (
        <ShareIdeaModal
          user={user}
          profile={profile}
          onClose={() => setModalOpen(false)}
          onPosted={onProjectPosted}
        />
      )}
    </>
  )
}