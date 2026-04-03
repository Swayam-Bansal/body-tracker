"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const [entries, setEntries] = useState([])
  const router = useRouter()

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("userBodyData")) || []
    if (stored.length === 0) {
      router.push("/")
    } else {
      setEntries(stored)
    }
  }, [])

  if (entries.length === 0) return null

  const latest = entries[entries.length - 1]
  const previous = entries.length > 1 ? entries[entries.length - 2] : null

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-400 text-sm">Last updated: {new Date(latest.timestamp).toLocaleDateString()}</p>
      </div>
    </main>
  )
}