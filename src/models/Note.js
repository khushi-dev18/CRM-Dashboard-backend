import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    lead: { type: mongoose.Schema.Types.ObjectId, ref: "Lead", default: null },
    contact: { type: mongoose.Schema.Types.ObjectId, ref: "Contact", default: null },
    pinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Note", noteSchema);
