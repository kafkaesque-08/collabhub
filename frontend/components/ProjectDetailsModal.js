"use client"
import { useState } from "react"
import ApplicationModal from "./ApplicationModal" 

export default function ProjectDetailsModal({ project, user, onClose }) {
  const [showAppModal, setShowAppModal] = useState(false); // State to trigger application

  if (!project) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 110,
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(4px)",
        }}
      />

      {/* Modal Container */}
      <div style={{
        position: "fixed", zIndex: 120,
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "min(600px, 94vw)",
        maxHeight: "90vh",
        overflowY: "auto",
        background: "#fff",
        borderRadius: 20,
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        
        {/* Header */}
        <div style={{
          padding: "24px 24px 16px",
          borderBottom: "1px solid #f3f4f6",
          display: "flex", justifyContent: "space-between", alignItems: "flex-start"
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#111827", lineHeight: 1.2 }}>
              {project.title}
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: 14, color: "#6b7280" }}>
              by <span style={{ fontWeight: 600, color: "#4f46e5" }}>{project.author_name}</span> • {project.college}
            </p>
          </div>
          <button onClick={onClose} style={{
            background: "none", border: "none", fontSize: 28, color: "#9ca3af", cursor: "pointer"
          }}>&times;</button>
        </div>

        {/* Content Body */}
        <div style={{ padding: 24 }}>
          
          {/* Tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
            {project.tags?.map(tag => (
              <span key={tag} style={{
                fontSize: 12, fontWeight: 600, padding: "4px 12px",
                background: "#f5f3ff", color: "#7c3aed",
                borderRadius: 20, border: "1px solid #ddd6fe"
              }}>
                {tag}
              </span>
            ))}
          </div>

          {/* Description Section */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 10px" }}>
              Project Overview
            </h3>
            <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
              {project.description}
            </p>
          </div>

          {/* GitHub Section */}
          {project.github_url && (
            <div style={{ 
              marginBottom: 24, padding: 16, background: "#f9fafb", 
              borderRadius: 12, border: "1px solid #f3f4f6" 
            }}>
              <h3 style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", margin: "0 0 10px" }}>
                Project Links
              </h3>
              <a 
                href={project.github_url} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  fontSize: 14, color: "#2563eb", textDecoration: "none", fontWeight: 600
                }}
              >
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.416-4.041-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                View Repository on GitHub
              </a>
            </div>
          )}

          {/* DYNAMIC ACTION BUTTONS */}
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            
            {(project.type === "Hiring" || project.type === "Seeking Team") && (
              <button 
                onClick={() => setShowAppModal(true)} // Open Application Modal
                style={{
                  flex: 1, padding: "14px 0", borderRadius: 12, border: "none",
                  background: "#7c3aed", color: "#fff", fontSize: 15, fontWeight: 700,
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  boxShadow: "0 10px 15px -3px rgba(124, 58, 237, 0.3)"
                }}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Apply / Send CV
              </button>
            )}

            {project.type === "Idea Feedback" && (
              <button style={{
                flex: 1, padding: "14px 0", borderRadius: 12, border: "none",
                background: "#f59e0b", color: "#fff", fontSize: 15, fontWeight: 700,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: "0 10px 15px -3px rgba(245, 158, 11, 0.3)"
              }}>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Give Insight
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Render Application Modal on top */}
      {showAppModal && (
        <ApplicationModal 
          project={project} 
          user={user} 
          onClose={() => setShowAppModal(false)} 
        />
      )}
    </>
  );
}