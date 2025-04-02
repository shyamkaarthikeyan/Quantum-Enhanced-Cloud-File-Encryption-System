"use client";

// app/page.tsx
import Navbar from "@/components/navbar";
import Link from "next/link";
import { Button } from "../components/ui/button"; // Adjust the path based on your project structure

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/background.jpg')",
        }}
      ></div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="glass-effect w-[90%] max-w-md p-8 text-center space-y-6">
            <h1 className="text-3xl font-bold text-white">Welcome</h1>
            <div className="space-y-4">
              <Link href="/login">
                <Button className="w-full bg-purple-900 hover:bg-purple-800 text-white">
                  Sign In
                </Button>
              </Link>
              <p className="text-white/70">or</p>
              <Link href="/signup">
                <Button
                  variant="outline"
                  className="w-full text-white border-white/30 hover:bg-white/10"
                >
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}