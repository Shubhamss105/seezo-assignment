// pages/assessment.tsx
"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "react-hot-toast";

const AssessmentPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [assessments, setAssessments] = useState<any[]>([]); // To store the assessments list

  // Fetch the existing assessments from MongoDB
  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await axios.get("/api/upload-assessment");
        setAssessments(response.data);
      } catch (error) {
        console.error("Error fetching assessments:", error);
      }
    };

    fetchAssessments();
  }, []);

  // Handle file upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // Handle submission of new assessment
  const handleSubmit = async () => {
    if (!file || !title) {
      toast.error("Please provide a title and select a file.");
      return;
    }

    // Step 1: Upload file to Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "assessments_preset"); // Ensure your preset matches Cloudinary settings

    try {
      const cloudinaryResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, // Replace with your Cloudinary cloud_name
        formData
      );

      const fileUrl = cloudinaryResponse.data.secure_url;

      // Step 2: Save file URL and assessment data to MongoDB
      const response = await axios.post("/api/upload-assessment", {
        title,
        fileUrl,
        createdAt: new Date().toISOString(),
        username: "Admin", // You can replace this with the logged-in user's username
      });

      if (response.status === 200) {
        toast.success("Assessment uploaded successfully!");
        setAssessments([...assessments, response.data]); // Update the table with new assessment
      }
    } catch (error) {
      console.error("Error uploading assessment:", error);
      toast.error("Failed to upload assessment.");
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Assessments</h1>

        {/* New Assessment Button */}
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Enter assessment title"
            className="border px-4 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input type="file" onChange={handleFileChange} />
          <Button onClick={handleSubmit}>
            <Plus /> New Assessment
          </Button>
        </div>
      </div>

      {/* Table to display assessments */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Open Questions</TableHead>
            <TableHead>Creator</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>File Link</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assessments.map((assessment, index) => (
            <TableRow key={index}>
              <TableCell>{assessment.title}</TableCell>
              <TableCell>{assessment.openQuestions || "N/A"}</TableCell>
              <TableCell>{assessment.username}</TableCell>
              <TableCell>{new Date(assessment.createdAt).toLocaleString()}</TableCell>
              <TableCell>
                <a href={assessment.fileUrl} target="_blank" rel="noreferrer">
                  View File
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AssessmentPage;
