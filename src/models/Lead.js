import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    company: { type: String, default: "" },
    status: { type: String, enum: ["New", "Qualified", "Proposal", "Won", "Lost"], default: "New" },
    priority: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" },
    source: { type: String, default: "" },
    value: { type: Number, default: 0 },
    notes: { type: String, default: "" },
    tags: [{ type: String }],
    order: { type: Number, default: 0 },
    aiSummary: { type: String, default: "" },
    aiRiskScore: { type: Number, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Lead", leadSchema);
