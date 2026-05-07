"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [profile, setProfile] = useState({
    name: "", 
    college: "", 
    year: "", 
    skills: "", 
  })
  const router = useRouter()

  useEffect(() => {
    getProfile()
  }, [])

  async function getProfile() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return router.push("/login")

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single()

    if (data) {
      
      setProfile({
        ...data,
        skills: data.skills ? data.skills.join(", ") : ""
      })
    }
    setLoading(false)
  }

  async function updateProfile(e) {
    e.preventDefault()
    setUpdating(true)
    const { data: { user } } = await supabase.auth.getUser()

    const skillsArray = profile.skills.split(",").map(s => s.trim()).filter(s => s !== "")

    const { error } = await supabase.from("users").upsert({
      id: user.id,
      email: user.email,
      name: profile.name,
      college: profile.college,
      year: profile.year,
      skills: skillsArray, 
    })

    if (error) {
        alert(error.message)
    } else {
        alert("Profile updated successfully!")
        router.push("/")
    }
    setUpdating(false)
  }

  if (loading) return <div className="p-10 text-center">Loading your profile...</div>

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-sm border border-gray-200 rounded-2xl mt-10">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
      
      <form onSubmit={updateProfile} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg mt-1"
            value={profile.name || ""}
            onChange={(e) => setProfile({...profile, name: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">College</label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg mt-1"
              value={profile.college || ""}
              onChange={(e) => setProfile({...profile, college: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Year</label>
            <input
              type="text"
              placeholder="e.g. 3rd Year"
              className="w-full p-2 border rounded-lg mt-1"
              value={profile.year || ""}
              onChange={(e) => setProfile({...profile, year: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Skills (comma separated)</label>
          <input
            type="text"
            placeholder="Python, ML, Next.js"
            className="w-full p-2 border rounded-lg mt-1"
            value={profile.skills || ""}
            onChange={(e) => setProfile({...profile, skills: e.target.value})}
          />
        </div>

        <button
          type="submit"
          disabled={updating}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors"
        >
          {updating ? "Updating..." : "Save Profile"}
        </button>
      </form>
    </div>
  )
}