"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { supabase } from "../../utils/supabase/client";

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        router.push("/verify-email");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen flex items-center justify-center">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/background.jpg')" }}></div>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      
      <div className="relative z-10 bg-white/20 backdrop-blur-lg p-8 rounded-lg text-center text-white shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">{mode === "login" ? "Login" : "Sign Up"}</h2>
        
        <form onSubmit={handleAuth} className="space-y-4 flex flex-col">
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full px-4 py-2 rounded bg-white/80 text-black placeholder-gray-600 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full px-4 py-2 rounded bg-white/80 text-black placeholder-gray-600 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
          >
            {loading ? "Processing..." : mode === "login" ? "Login" : "Sign Up"}
          </Button>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      </div>
    </div>
  );
}
