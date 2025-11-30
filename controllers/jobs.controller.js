const mongoose = require("mongoose");
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

/* 
  aggregate : , MongoDB’de veri üzerinde pipeline mantığıyla kompleks sorgular yapmamıza olanak sağlayan bir metod.
  Basit find() sorgularından farklı olarak:

  Filtreleme

  Gruplama

  Sıralama

  Projeksiyon (istediğin alanları seçme)

  Hesaplamalar (count, sum, avg vb.)

  hepsini zincirleme olarak yapabilirsin.

  Yani aggregate = veriyi adım adım işleyen bir boru hattı (pipeline).
*/

exports.getUserJobsController = async (req, res) => {
  console.log("📩 Incoming getUserJobs request");
  console.log("👤 Logged-in userId:", req.user.userId);

  try {
    const jobs = await Job.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(req.user.userId),
        },
      },
    ]);

    console.log(`📄 Found ${jobs.length} jobs for user ${req.user.userId}`);
    console.log("🗂 Jobs data:", jobs);

    return res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("❌ getUserJobsController error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
    });
  }
};
/* 
group: _id = gruplanacak alan (status)

count = her status’ün kaç tane olduğunu sayıyor ($sum:1)
*/

exports.getStatusJobsController = async (req, res) => {
  try {
    // Kullanıcıya ait job’ları status bazında gruplama
    const stats = await Job.aggregate([
      {
        $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) },
      },
      {
        $group: { _id: "$status", count: { $sum: 1 } },
      },
    ]);

    const defaultStats = {
      pending: stats.PENDING || 0,
      reject: stats.REJECT || 0,
      interview: stats.INTERVIEW || 0,
    };

    return res.status(200).json({
      success: true,
      count: stats.length,
      defaultStats,
      stats,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
    });
  }
};

exports.getTopCompaniesController = async (req, res) => {
  try {
    const topCompanies = await Job.aggregate([
      {
        $group: {
          _id: { company: "$company", status: "$status" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.company": 1, "_id.status": -1 },
      },
      {
        $project: {
          _id: 0,
          company: "$_id.company",
          status: "$_id.status",
          count: 1,
        },
      },
      { $limit: 5 },
    ]);

    return res.status(200).json({
      success: true,
      totalCompanies: topCompanies.length,
      topCompanies,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
    });
  }
};

exports.getFilteredJobsController = async (req, res) => {
  console.log("📩 Incoming getUserJobs request");
  console.log("👤 Logged-in userId:", req.user.userId);
  console.log("🔍 Query params:", req.query);
  

  try {
    const {status,company,sortBy,limit} = req.query ;

    // dinamik match objesi oluştur 

    const matchObj = {createdBy : new mongoose.Types.ObjectId(req.user.userId)};

    if (status) matchObj.status = status.toUpperCase();
    if (company) matchObj.company = company;

    const jobsPipeline = [
      {$match:matchObj}
    ]

     // Sort ekleme
    if (sortBy) {
      const [field, order] = sortBy.split(":"); // örnek: sortBy=createdAt:-1
      jobsPipeline.push({ $sort: { [field]: parseInt(order) } });
    }

    // Limit ekleme
    if (limit) {
      jobsPipeline.push({ $limit: parseInt(limit) });
    }

    const jobs = await Job.aggregate(jobsPipeline);

    console.log(`📄 Found ${jobs.length} jobs for user ${req.user.userId}`);
    console.log("🗂 Jobs data:", jobs);

  return res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
    });
  }
};
