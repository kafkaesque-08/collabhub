import { Geist } from "next/font/google"
import "./globals.css"
import Navbar from "../components/Navbar"

const geist = Geist({ subsets: ["latin"] })

export const metadata = {
  title: "CollabHub",
  description: "Find your team. Build something great.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-gray-50 min-h-screen`}>
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}