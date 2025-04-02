import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <nav className="p-4 flex items-center justify-between relative z-10">
      <div className="hidden md:flex space-x-8 text-white">
        <Link href="/" className="hover:text-secondary transition-colors">
          Home
        </Link>
        <Link href="#" className="hover:text-secondary transition-colors">
          Service
        </Link>
        <Link href="#" className="hover:text-secondary transition-colors">
          Contact
        </Link>
        <Link href="#" className="hover:text-secondary transition-colors">
          About
        </Link>
      </div>
      <Button variant="outline" className="text-white border-white hover:bg-white/10">
        Sign Up
      </Button>
    </nav>
  )
}

