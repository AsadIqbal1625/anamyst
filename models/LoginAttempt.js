import mongoose from "mongoose";

/* Failed admin login attempts — auto-deleted after 15 minutes (TTL) */
const LoginAttemptSchema = new mongoose.Schema({
  key: { type: String, index: true },
  createdAt: { type: Date, default: Date.now, expires: 900 },
});

export default mongoose.models.LoginAttempt ||
  mongoose.model("LoginAttempt", LoginAttemptSchema);
