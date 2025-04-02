"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { X } from "lucide-react"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would validate credentials here
    // For demo purposes, we'll just navigate to the dashboard
    router.push("/dashboard")
  }

  return (
    <div className="glass-effect w-[90%] max-w-md p-8 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Login</h2>
        <button className="text-white">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <div className="relative">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent border-white/30 text-white placeholder:text-white/70"
              required
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white">✉</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="relative">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent border-white/30 text-white placeholder:text-white/70"
              required
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white">🔒</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            className="border-white data-[state=checked]:bg-purple-700 data-[state=checked]:border-purple-700"
          />
          <label
            htmlFor="remember"
            className="text-sm font-medium text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Remember Me
          </label>
        </div>

        <Button type="submit" className="w-full bg-purple-900 hover:bg-purple-800 text-white">
          Login
        </Button>
      </form>
    </div>
  )
}

