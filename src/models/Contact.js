import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    title: { type: String, default: "" },
    company: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    tags: [{ type: String }],
    favorite: { type: Boolean, default: false },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Contact", contactSchema);
