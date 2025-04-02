"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Database, FileText, Loader } from "lucide-react";

const API_URL = "http://54.91.83.80:8080"; // FastAPI backend URL

export default function StorageSection({ isActive }: { isActive: boolean }) {
  const [files, setFiles] = useState<{ name: string; size: number; date: string }[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [decryptionKey, setDecryptionKey] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedDek = localStorage.getItem("decryption_key");
    console.log("Retrieved DEK:", storedDek); // Debugging
    if (storedDek) setDecryptionKey(storedDek);
  }, []);

  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/list-files`);
      if (!response.data.files) throw new Error("No files found.");
      const formattedFiles = response.data.files.map((file: { name: string; size?: number; date?: string }) => ({
        name: file.name,
        size: file.size || 0,
        date: file.date || new Date().toISOString(),
      }));
      setFiles(formattedFiles);
    } catch (error) {
      console.error("❌ Error fetching files:", error);
      alert("Failed to load files.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecryptPrompt = (fileName: string) => {
    setSelectedFile(fileName);
    setIsDialogOpen(true);
  };

  const handleDecrypt = async () => {
    if (!decryptionKey || !selectedFile) {
      return alert("⚠️ Please enter a valid decryption key.");
    }

    const formData = new FormData();
    formData.append("decryption_key", decryptionKey);
    formData.append("encrypted_filename", selectedFile);

    try {
      console.log("Sending DEK for decryption:", decryptionKey); // Debugging
      console.log("Decrypting file:", selectedFile);

      const response = await axios.post(`${API_URL}/decrypt/`, formData, { responseType: "blob" });

      if (response.status === 200) {
        console.log("✅ Decryption successful, downloading file...");
        
        // Convert blob to a downloadable URL
        const blob = new Blob([response.data], { type: "application/octet-stream" });
        const url = window.URL.createObjectURL(blob);

        // Create download link and trigger automatic download
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", selectedFile.replace("encrypted_", "")); // Remove "encrypted_" prefix
        document.body.appendChild(link);
        link.click();

        alert("✅ File decrypted successfully.");
      } else {
        throw new Error("Invalid decryption key or corrupted file.");
      }
    } catch (error: any) {
      console.error("❌ Error decrypting file:", error);
      alert("❌ Decryption failed. Check if the key is correct.");

      // Send unauthorized access alert
      try {
        await axios.post(`${API_URL}/send-alert`, { message: `⚠️ Unauthorized decryption attempt detected for ${selectedFile}` });
      } catch (alertError) {
        console.error("❌ Failed to send unauthorized access alert:", alertError);
      }
    } finally {
      setIsDialogOpen(false);
    }
  };

  useEffect(() => {
    if (isActive) fetchFiles();
  }, [isActive]);

  return (
    <div className="h-full flex flex-col items-center justify-center text-white">
      <div className="mb-6">
        <Database size={48} className="mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-center">Access Storage</h2>
        <p className="text-white/70 text-center mt-2">View and manage your encrypted files</p>
      </div>
      
      {isActive && (
        <>
          <Button onClick={fetchFiles} className="bg-purple-700 hover:bg-purple-600 px-6">
            {isLoading ? <Loader className="animate-spin mr-2" /> : "Fetch Encrypted Files"}
          </Button>
          <div className="w-full max-w-3xl mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-400">
                      No files found.
                    </TableCell>
                  </TableRow>
                ) : (
                  files.map((file, index) => (
                    <TableRow key={index}>
                      <TableCell className="flex items-center gap-2">
                        <FileText className="text-purple-500" />
                        {file.name}
                      </TableCell>
                      <TableCell>{(file.size / 1024).toFixed(2)} KB</TableCell>
                      <TableCell>{new Date(file.date).toLocaleString()}</TableCell>
                      <TableCell>
                        <Button variant="outline" onClick={() => handleDecryptPrompt(file.name)} className="text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white">
                          Decrypt
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      {/* Decryption Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Decrypt File</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <p className="text-sm text-gray-500">Enter the decryption key to decrypt the selected file.</p>
            <Input
              type="text"
              placeholder="Decryption key"
              value={decryptionKey}
              onChange={(e) => setDecryptionKey(e.target.value)}
            />
            <Button onClick={handleDecrypt} className="bg-green-600 hover:bg-green-500">
              Decrypt File
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}