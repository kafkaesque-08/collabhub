"use client"
import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import Link from "next/link"

export default function Navbar() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check for the active user on mount
    const getUser = async () => {
      const { data: { user: activeUser } } = await supabase.auth.getUser()
      setUser(activeUser)
    }
    getUser()

    // Listen for login/logout changes to update the UI initials instantly
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => authListener.subscription.unsubscribe()
  }, [])

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        
        {/* Logo - Returns to Feed */}
        <Link href="/" className="text-xl font-bold no-underline text-gray-900">
          Collab<span className="text-indigo-600">Hub</span>
        </Link>
        
        {/* Main Navigation */}
        <div className="hidden md:flex items-center gap-2">
          {["Feed", "Explore", "Network"].map((item) => (
            <button key={item} className="text-sm text-gray-500 hover:text-indigo-600 px-3 py-1.5 rounded-full hover:bg-indigo-50 transition-all font-medium">
              {item}
            </button>
          ))}
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              {/* Profile Circle: Dynamically shows your initial (e.g., 'N') instead of 'RK' */}
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-sm cursor-pointer">
                {user.email?.charAt(0).toUpperCase()}
              </div>
            </div>
          ) : (
            <Link 
              href="/login" 
              className="text-sm bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 transition-all font-semibold no-underline"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}