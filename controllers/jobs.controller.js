const Job = require("../models/jobs.model");

// CREATE JOB
exports.createJobController = async (req, res) => {
  try {
    const { company, position, status, workType, workLocation } = req.body;

    console.log("📩 Incoming createJob request:", req.body);

    if (!company || !position) {
      console.warn("⚠ Missing required fields");
      return res
        .status(400)
        .json({ success: false, message: "Company and position are required" });
    }

    const newJob = await Job.create({
      company,
      position,
      status: status,
      workType: workType,
      workLocation: workLocation,
      createdBy: req.user.userId,
    });

    console.log("✅ Job created successfully:", newJob._id);

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      job: newJob,
    });
  } catch (error) {
    console.error("❌ createJobController error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// GET ALL JOBS
exports.getJobsController = async (req, res) => {
  try {
    const jobs = await Job.find({ createdBy: req.user.userId }).sort({
      createdAt: -1,
    });

    console.log(`📄 Fetched ${jobs.length} jobs for user:`, req.user.userId);

    return res.status(200).json({ success: true, jobs });
  } catch (error) {
    console.error("❌ getJobsController error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// GET SINGLE JOB
exports.getJobController = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findOne({ _id: id, createdBy: req.user.userId });

    if (!job)
      return res.status(404).json({ success: false, message: "Job not found" });

    console.log("📄 Fetched job:", id);
    return res.status(200).json({ success: true, job });
  } catch (error) {
    console.error("❌ getJobController error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// UPDATE JOB
exports.updateJobController = async (req, res) => {
  try {
    const { id } = req.params;
    const { company, position, status, workType, workLocation } = req.body;

    const job = await Job.findOne({ _id: id, createdBy: req.user.userId });
    if (!job)
      return res.status(404).json({ success: false, message: "Job not found" });

    console.log("🔄 Updating job fields for job:", id);
    if (company) job.company = company;
    if (position) job.position = position;
    if (status) job.status = status;
    if (workType) job.workType = workType;
    if (workLocation) job.workLocation = workLocation;

    await job.save();
    console.log("✅ Job updated successfully:", id);

    return res
      .status(200)
      .json({ success: true, message: "Job updated successfully", job });
  } catch (error) {
    console.error("❌ updateJobController error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// DELETE JOB
exports.deleteJobController = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findOneAndDelete({
      _id: id,
      createdBy: req.user.userId,
    });
    if (!job)
      return res.status(404).json({ success: false, message: "Job not found" });

    console.log("🗑 Job deleted successfully:", id);
    return res
      .status(200)
      .json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    console.error("❌ deleteJobController error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
