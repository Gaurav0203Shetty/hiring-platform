'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloudIcon } from 'lucide-react';

export default function ResumeUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setParsedData(null); // reset previous data
      setError(null);
    }
  }

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      // APILayer Resume Parser API expects raw binary data.
      // We can send the file directly using the file's Blob.
      const fileBlob = file;
      
      const response = await fetch("https://api.apilayer.com/resume_parser/upload", {
        method: "POST",
        headers: {
          // Do not set Content-Type; let browser set the correct boundary for FormData.
          "apikey": process.env.NEXT_PUBLIC_RESUME_PARSER_API_KEY || "",
        },
        body: fileBlob,
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      // Map the response to a simpler structure if needed.
      setParsedData({
        name: data.name || "N/A",
        email: data.email || "N/A",
        skills: data.skills ? data.skills.join(", ") : "N/A",
        education: data.education ? data.education.map((edu: any) => edu.name).join(", ") : "N/A",
        experience: data.experience ? data.experience.map((exp: any) => exp.title).join(", ") : "N/A",
      });
    } catch (err: any) {
      console.error("Error parsing resume:", err);
      setError(err.message || "Failed to parse resume");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Resume Processing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!parsedData ? (
            <>
              <div className="flex flex-col items-center border-2 border-dashed border-gray-300 p-8 rounded-lg">
                <UploadCloudIcon className="h-12 w-12 text-gray-400" />
                <p className="mt-4 text-gray-600">Drag and drop your resume here or</p>
                <Label
                  htmlFor="resume-upload"
                  className="mt-2 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Choose File
                </Label>
                <small className='mt-4 text-gray-600'>.doc / .docx / .pdf</small>
                <Input
                  id="resume-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt,.rtf"
                />
              </div>

              {file && (
                <div className="text-center">
                  <p className="text-gray-700">Selected file: {file.name}</p>
                  <Button
                    onClick={handleUpload}
                    className="mt-4 w-full"
                    disabled={uploading}
                  >
                    {uploading ? 'Processing...' : 'Upload & Process'}
                  </Button>
                  {error && (
                    <p className="mt-2 text-sm text-red-600">{error}</p>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Parsed Information</h2>
              <p><span className="font-medium">Name:</span> {parsedData.name}</p>
              <p><span className="font-medium">Email:</span> {parsedData.email}</p>
              <p><span className="font-medium">Skills:</span> {parsedData.skills}</p>
              <p><span className="font-medium">Education:</span> {parsedData.education}</p>
              <p><span className="font-medium">Experience:</span> {parsedData.experience}</p>
              <Button onClick={() => setParsedData(null)} className="w-full mt-4">
                Process Another Resume
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
