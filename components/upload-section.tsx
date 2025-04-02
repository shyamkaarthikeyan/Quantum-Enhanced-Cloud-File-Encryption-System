"use client";

import { useState, useRef } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Upload, FileUp } from "lucide-react";

interface UploadSectionProps {
  isActive: boolean;
}
const API_URL = process.env.NEXT_PUBLIC_API_URL;


export default function UploadSection({ isActive }: UploadSectionProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [encryptionType, setEncryptionType] = useState<"RSA" | "SABER">("RSA");
  const [isUploading, setIsUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dekDownloadLink, setDekDownloadLink] = useState<string | null>(null);
  const [dekKeyValue, setDekKeyValue] = useState<string | null>(null);
  const [decryptionKey, setDecryptionKey] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file before uploading.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("encryption_type", encryptionType);

    try {
      const response = await axios.post(`${API_URL}/upload/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("✅ Upload successful:", response.data);
      alert("File uploaded successfully!");

      if (response.data.dek_file_download) {
        setDekDownloadLink(response.data.dek_file_download);
      } else {
        alert("⚠️ No DEK file link received. Check backend logs.");
      }

      if (response.data.dek_key) {
        setDekKeyValue(response.data.dek_key);
      } else {
        alert("⚠️ No DEK key value received. Check backend logs.");
      }

      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setIsDialogOpen(false);
    } catch (error) {
      console.error("❌ Upload failed:", error);
      alert("Upload failed! Check console for details.");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle file decryption (Download)
  const handleDownload = async () => {
    if (!decryptionKey) {
      alert("Please enter the decryption key.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("decryption_key", decryptionKey);

      const response = await axios.post(`${API_URL}/decrypt/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("✅ Decryption successful:", response.data);
      alert("File decrypted successfully!");

      const fileUrl = response.data.decrypted_filename;
      window.location.href = fileUrl; // Trigger download by navigating to the URL
    } catch (error) {
      console.error("❌ Decryption failed:", error);
      alert("Decryption failed! Check console for details.");
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center text-white">
      <div className="mb-6">
        <Upload size={48} className="mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-center">Upload Files</h2>
        <p className="text-white/70 text-center mt-2">Securely upload and encrypt your files</p>
      </div>

      {/* Display DEK file download link and key here after successful upload */}
      {dekDownloadLink && dekKeyValue && (
        <div className="mt-4 text-center p-4 bg-white/10 rounded-lg">
          <p className="text-white">🔑 <strong>Download your DEK file:</strong></p>
          <a href={dekDownloadLink} className="text-blue-400 underline" target="_blank" rel="noopener noreferrer">
            Download DEK
          </a>
          <p className="mt-2 text-white">🔐 <strong>Your DEK key:</strong> {dekKeyValue}</p>
        </div>
      )}

      {isActive && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-700 hover:bg-purple-600">
              <FileUp className="mr-2 h-4 w-4" />
              Upload File
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gradient-purple border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Choose Encryption Method</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <RadioGroup
                value={encryptionType}
                onValueChange={(value) => setEncryptionType(value as "RSA" | "SABER")}
                className="flex flex-col space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="RSA" id="rsa" className="border-white text-white" />
                  <Label htmlFor="rsa" className="text-white">RSA Encryption</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="SABER" id="saber" className="border-white text-white" />
                  <Label htmlFor="saber" className="text-white">Saber Encryption</Label>
                </div>
              </RadioGroup>

              <div className="space-y-2">
                <Label htmlFor="file" className="text-white">Select File</Label>
                <input id="file" type="file" onChange={handleFileChange} ref={fileInputRef} className="w-full text-white bg-white/10 rounded-md p-2" />
              </div>

              <Button onClick={handleUpload} disabled={!selectedFile || isUploading} className="w-full bg-purple-700 hover:bg-purple-600">
                {isUploading ? "Uploading..." : "Upload and Encrypt"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Decryption Section */}
      <div className="mt-8 space-y-4">
        <h3 className="text-xl text-center text-white">Decrypt Your File</h3>
        <div className="space-y-2">
          <Label htmlFor="decryptionKey" className="text-white">Enter Your Decryption Key</Label>
          <input
            id="decryptionKey"
            type="text"
            value={decryptionKey || ""}
            onChange={(e) => setDecryptionKey(e.target.value)}
            className="w-full text-black bg-white/50 rounded-md p-2"
          />
        </div>
        <Button onClick={handleDownload} disabled={!decryptionKey} className="w-full bg-purple-700 hover:bg-purple-600">
          Download Decrypted File
        </Button>
      </div>
    </div>
  );
}