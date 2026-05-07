"use client"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase" 

export default function LeftSidebar({ user, profile }) {
  const router = useRouter()

  async function handleLogout() {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error("Error logging out:", error.message)
    } else {
      router.push("/login")
      router.refresh() 
    }
  }

  return (
    <div style={{
      background: "#fff",
      borderRadius: 12,
      border: "1px solid #e5e7eb",
      overflow: "hidden",
      position: "sticky",
      top: 72
    }}>
      <div style={{ 
        height: 56, 
        background: "linear-gradient(135deg, #6366f1, #8b5cf6)" 
      }} />
      
      <div style={{ padding: "0 16px 16px", textAlign: "center", marginTop: -28 }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          background: "#fff", border: "4px solid #fff",
          margin: "0 auto", display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 24, fontWeight: 700,
          color: "#6366f1", boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}>
          {/* Change full_name to name */}
          {(profile?.name || user?.email || "U").charAt(0).toUpperCase()}
        </div>
        
        <h2 style={{ margin: "12px 0 4px", fontSize: 16, fontWeight: 700, color: "#111827" }}>
          {/* Changed Welcome! to your real name from the DB */}
          {profile?.name || "Welcome!"}
        </h2>
        <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>
          {profile?.college || (user ? "Student" : "Sign in to join the hub")}
        </p>

        {/* --- NEW SKILLS SECTION --- */}
        {profile?.skills && profile.skills.length > 0 && (
          <div style={{ 
            display: "flex", 
            flexWrap: "wrap", 
            gap: "4px", 
            justifyContent: "center", 
            marginTop: "12px" 
          }}>
            {profile.skills.map((skill, index) => (
              <span key={index} style={{
                fontSize: "10px",
                background: "#f3f4f6",
                padding: "2px 8px",
                borderRadius: "12px",
                color: "#4b5563",
                border: "1px solid #e5e7eb"
              }}>
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      <div style={{ borderTop: "1px solid #f3f4f6", padding: "12px 0" }}>
        <button 
          onClick={() => router.push('/profile')}
          style={{
            width: "100%", padding: "8px 16px", textAlign: "left",
            background: "none", border: "none", fontSize: 13,
            color: "#374151", cursor: "pointer", fontWeight: 500
          }}>
          👤 My Profile
        </button>
        
        {user && (
          <button 
            onClick={handleLogout}
            style={{
              width: "100%", padding: "8px 16px", textAlign: "left",
              background: "none", border: "none", fontSize: 13,
              color: "#ef4444", cursor: "pointer", fontWeight: 500
            }}>
            Logout
          </button>
        )}
      </div>
    </div>
  )
}