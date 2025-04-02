"use client"

import { useState } from "react"
import UploadSection from "@/components/upload-section"
import StorageSection from "@/components/storage-section"
import DashboardHeader from "@/components/dashboard-header"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"upload" | "storage">("upload")

  return (
    <div className="min-h-screen bg-gradient-purple">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">Encryption</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            className={`glass-effect p-6 cursor-pointer transition-all ${
              activeTab === "upload" ? "ring-2 ring-secondary" : ""
            }`}
            onClick={() => setActiveTab("upload")}
          >
            <UploadSection isActive={activeTab === "upload"} />
          </div>

          <div
            className={`glass-effect p-6 cursor-pointer transition-all ${
              activeTab === "storage" ? "ring-2 ring-secondary" : ""
            }`}
            onClick={() => setActiveTab("storage")}
          >
            <StorageSection isActive={activeTab === "storage"} />
          </div>
        </div>
      </main>
    </div>
  )
}

