const express = require("express");
const userAuth = require("../middlewares/auth.middleware");
const {
  createJobController,
  getJobsController,
  getJobController,
  updateJobController,
  deleteJobController,
} = require("../controllers/jobs.controller");

const router = express.Router();

// CREATE
router.post("/create-job", userAuth, createJobController);

// READ
router.get("/", userAuth, getJobsController); // tüm kullanıcı jobları
router.get("/:id", userAuth, getJobController); // tek job

// UPDATE
router.patch("/update/:id", userAuth, updateJobController);

// DELETE
router.delete("/delete/:id", userAuth, deleteJobController);

module.exports = router;
