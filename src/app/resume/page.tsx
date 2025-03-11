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
                    {uploading ? <div role="status">
                                  Processing... &nbsp;
                                  <svg aria-hidden="true" className="inline w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                  </svg>
                                </div>
                     : 'Upload & Process'}
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
