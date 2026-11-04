import mongoose from "mongoose";

/* One document per hit, keyed "<bucket>:<ip>". Auto-deleted after
   10 minutes (TTL), so counting documents = hits in the last window. */
const RateLimitSchema = new mongoose.Schema({
  key: { type: String, index: true },
  createdAt: { type: Date, default: Date.now, expires: 600 },
});

export default mongoose.models.RateLimit ||
  mongoose.model("RateLimit", RateLimitSchema);
