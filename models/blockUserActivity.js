const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  ObjectId = Schema.Types.ObjectId;
const blockUserActivitySchema = new Schema(
  {
    user_id: { type: ObjectId, ref: "User" },
    block_id: { type: ObjectId, ref: "Block" },
    course_id: { type: ObjectId, ref: "Course" },
    cohort_id: { type: ObjectId, ref: "Cohort" },

    mcq_option_ids: { type: Array },
    response_id: { type: ObjectId, ref: "fills._id" },
    response_text: { type: String },
    response_type: {
      type: String,
      enum: ["text", "audio", "video", "canvas", "file"],
    },
    response_value: { type: String },
    type: { type: String },
    attachments: { type: Array },
    matched_array: { type: Array },
    NoOfAttempts: { type: Number, default: 0 },
    fills: { type: Array },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "block_user_activities_new_2",
  blockUserActivitySchema
);
