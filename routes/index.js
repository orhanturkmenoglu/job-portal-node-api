const { Router } = require("express");
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const jobsRoutes = require("./jobs.routes");
const testRoutes = require("./test.routes");

const router = Router();


router.use("/auth",authRoutes);   
router.use("/user",userRoutes);
router.use("/jobs",jobsRoutes);
router.use("/test",testRoutes);


module.exports = router;