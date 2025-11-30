const express = require("express");
const userAuth = require("../middlewares/auth.middleware");
const {
  createJobController,
  getJobsController,
  getJobController,
  updateJobController,
  deleteJobController,
  getUserJobsController,
  getStatusJobsController,
  getTopCompaniesController,
  getFilteredJobsController,
} = require("../controllers/jobs.controller");

const router = express.Router();

// ======================
// CREATE
// ======================
router.post("/create-job", userAuth, createJobController);

// ======================
// READ (Listeleme & Filtreleme)
// ======================
router.get("/", userAuth, getJobsController); // Tüm kullanıcı jobları
router.get("/filtered", userAuth, getFilteredJobsController); // Filtrelenmiş job'lar
router.get("/getUserJobs", userAuth, getUserJobsController); // Kullanıcıya özel job'lar
router.get("/getStatusJobs", userAuth, getStatusJobsController); // Status bazlı job'lar
router.get("/getTopCompanies", userAuth, getTopCompaniesController); // Top şirketler

// ======================
// READ (Tek Job)
// ======================
router.get("/:id", userAuth, getJobController); // Tek job

// ======================
// UPDATE
// ======================
router.patch("/update/:id", userAuth, updateJobController);

// ======================
// DELETE
// ======================
router.delete("/delete/:id", userAuth, deleteJobController);

module.exports = router;
