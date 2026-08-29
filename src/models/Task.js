import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    dueDate: { type: Date, default: null },
    status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
    priority: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" },
    relatedLead: { type: mongoose.Schema.Types.ObjectId, ref: "Lead", default: null },
    relatedContact: { type: mongoose.Schema.Types.ObjectId, ref: "Contact", default: null },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
