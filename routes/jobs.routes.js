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

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Job management API
 */

/**
 * @swagger
 * /jobs/create-job:
 *   post:
 *     summary: Create a new job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - company
 *               - position
 *             properties:
 *               company:
 *                 type: string
 *               position:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [PENDING, REJECTED, INTERVIEW]
 *               workType:
 *                 type: string
 *               workLocation:
 *                 type: string
 *     responses:
 *       201:
 *         description: Job created successfully
 */
router.post("/create-job", userAuth, createJobController);

/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: Get all jobs for logged-in user
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user jobs
 */
router.get("/", userAuth, getJobsController);

/**
 * @swagger
 * /jobs/filtered:
 *   get:
 *     summary: Get filtered user jobs
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: company
 *         schema:
 *           type: string
 *         description: Filter by company
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status
 *       - in: query
 *         name: position
 *         schema:
 *           type: string
 *         description: Filter by position
 *     responses:
 *       200:
 *         description: Filtered jobs list
 */
router.get("/filtered", userAuth, getFilteredJobsController);

/**
 * @swagger
 * /jobs/getUserJobs:
 *   get:
 *     summary: Get jobs created by logged-in user using aggregation
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Aggregated user jobs
 */
router.get("/getUserJobs", userAuth, getUserJobsController);

/**
 * @swagger
 * /jobs/getStatusJobs:
 *   get:
 *     summary: Get job statistics by status
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Job counts by status
 */
router.get("/getStatusJobs", userAuth, getStatusJobsController);

/**
 * @swagger
 * /jobs/getTopCompanies:
 *   get:
 *     summary: Get top companies with aggregated job info
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Top companies (limited by 5)
 */
router.get("/getTopCompanies", userAuth, getTopCompaniesController);

/**
 * @swagger
 * /jobs/{id}:
 *   get:
 *     summary: Get job by ID
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job found
 *       404:
 *         description: Job not found
 */
router.get("/:id", userAuth, getJobController);

/**
 * @swagger
 * /jobs/update/{id}:
 *   patch:
 *     summary: Update job by ID
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Job updated successfully
 */
router.patch("/update/:id", userAuth, updateJobController);

/**
 * @swagger
 * /jobs/delete/{id}:
 *   delete:
 *     summary: Delete job by ID
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job deleted successfully
 */
router.delete("/delete/:id", userAuth, deleteJobController);

module.exports = router;
