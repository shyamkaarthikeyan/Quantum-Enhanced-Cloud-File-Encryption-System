"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function DashboardHeader() {
  const router = useRouter()

  const handleLogout = () => {
    router.push("/")
  }

  return (
    <header className="bg-black/20 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Button variant="ghost" className="text-white hover:bg-white/10" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  )
}

