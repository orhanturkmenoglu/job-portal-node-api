const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    position: {
      type: String,
      required: [true, "Position is required"],
      maxlength: [100, "Position must be at most 100 characters"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "REJECT", "INTERVIEW","DECLINED","INTERVIEW"],
      default: "PENDING",
    },
    workType: {
      type: String,
      enum: [
        "FULL-TIME",
        "PART-TIME",
        "REMOTE",
        "HYBRID",
        "ON-SITE",
        "INTERNSHIP",
        "CONTRACT",
      ],
      default: "FULL-TIME",
    },
    workLocation: {
      type: String,
      default: "TURKEY",
      required: [true, "Work location is required"],
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
