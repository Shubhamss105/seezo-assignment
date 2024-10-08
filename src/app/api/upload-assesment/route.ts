// /pages/api/upload-assessment.ts
import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";

// MongoDB connection
const client = new MongoClient(process.env.MONGODB_URI!);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { title, fileUrl, createdAt, username } = req.body;

    try {
      // Connect to MongoDB and insert assessment data
      await client.connect();
      const db = client.db("next-assessment");
      const assessments = db.collection("assessments");

      const newAssessment = {
        title,
        fileUrl,
        openQuestions: 0, // Default to 0, modify as needed
        createdAt,
        username,
      };

      const result = await assessments.insertOne(newAssessment);
      res.status(200).json(newAssessment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to save assessment to MongoDB." });
    }
  } else if (req.method === "GET") {
    try {
      // Fetch existing assessments from MongoDB
      await client.connect();
      const db = client.db("next-assessment");
      const assessments = db.collection("assessments");

      const data = await assessments.find().toArray();
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch assessments from MongoDB." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
};

export default handler;
