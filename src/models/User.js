import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: "owner" },
    company: { type: String, default: "" },
    avatar: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
