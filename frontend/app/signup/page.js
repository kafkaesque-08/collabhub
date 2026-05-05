"use client"
import { useState } from "react"
import { supabase } from "../../lib/supabase"

export default function Signup() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSignup() {
    if (!email || !password) {
      alert("Please fill in both fields!")
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    })
    setLoading(false)
    if (error) {
      alert(error.message)
    } else {
      alert("Account created! Please log in.")
      window.location.href = "/login"
    }
  }

  // THE UI PART

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 w-full max-w-md">

        <h1 className="text-2xl font-bold text-gray-800 mb-2">Create account</h1>
        <p className="text-gray-400 text-sm mb-6">Join CollabHub and find your team</p>

        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 outline-none focus:border-purple-400"
        />

        <input
          type="password"
          placeholder="Choose a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 outline-none focus:border-purple-400"
        />

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full py-2.5 bg-purple-600 text-white rounded-xl font-semibold text-sm hover:bg-purple-700 disabled:opacity-60 transition-all"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="text-center text-sm text-gray-400 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-purple-600 font-medium hover:underline">Log in</a>
        </p>

      </div>
    </main>
  )
}