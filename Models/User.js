import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkUserId: { type: String, required: true, unique: true },
    email: { type: String, required: false, lowercase: true, trim: true },
    firstName: { type: String },
    lastName: { type: String },
    avatarUrl: { type: String },
    role: { type: String, enum: ["user"], default: "user" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
