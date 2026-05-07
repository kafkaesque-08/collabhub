"use client"
import { useState, useEffect } from "react"
// Import your local supabase client
import { supabase } from "../lib/supabase"

const TRENDING = [
  { tag: "Next.js", count: 24 },
  { tag: "React", count: 18 },
  { tag: "Supabase", count: 12 },
  { tag: "Tailwind", count: 10 },
]

export default function RightSidebar() {
  // Removed the createClientComponentClient() import and call that caused the error

  return (
    <div style={{
      background: "#fff",
      borderRadius: 12,
      border: "1px solid #e5e7eb",
      padding: "16px",
      position: "sticky",
      top: 72
    }}>
      <h3 style={{ 
        margin: "0 0 16px", 
        fontSize: 14, 
        fontWeight: 700, 
        color: "#111827" 
      }}>
        Trending Topics
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {TRENDING.map((item) => (
          <div key={item.tag} style={{ cursor: "pointer" }}>
            <p style={{ 
              margin: 0, 
              fontSize: 13, 
              fontWeight: 600, 
              color: "#374151" 
            }}>
              #{item.tag}
            </p>
            <p style={{ 
              margin: 0, 
              fontSize: 11, 
              color: "#9ca3af" 
            }}>
              {item.count} posts this week
            </p>
          </div>
        ))}
      </div>

      <div style={{ 
        marginTop: 20, 
        paddingTop: 16, 
        borderTop: "1px solid #f3f4f6" 
      }}>
        <button style={{
          width: "100%",
          padding: "8px",
          borderRadius: 8,
          border: "1px solid #6366f1",
          background: "transparent",
          color: "#6366f1",
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer"
        }}>
          View more topics
        </button>
      </div>
    </div>
  )
}