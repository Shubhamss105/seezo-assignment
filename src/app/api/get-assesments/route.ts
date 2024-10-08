// /pages/api/get-assessments.ts
import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      await client.connect();
      const db = client.db("next-assessment");
      const assessments = db.collection("assessments");

      const allAssessments = await assessments.find({}).toArray();
      res.status(200).json(allAssessments);
    } catch (error) {
      console.error("Error fetching assessments:", error);
      res.status(500).json({ error: "Error fetching assessments." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
};

export default handler;
