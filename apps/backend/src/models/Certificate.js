import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    certificateId: { type: String, required: true, unique: true },
    hashHex: { type: String, required: true },
    studentName: { type: String, required: true },
    courseName: { type: String, required: true },
    issueDate: { type: String, required: true },
    txHash: { type: String, required: true }
  },
  { timestamps: true }
);

export const Certificate = mongoose.model("Certificate", certificateSchema);
