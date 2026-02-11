// backend/models/Activity.js
import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  type: String,
  message: String,
  meta: Object,
}, { timestamps: true });

export default mongoose.model("Activity", activitySchema);
