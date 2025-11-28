const express = require("express");
const testPostController = require("../controllers/test.controller");
const { route } = require("../server");

const router = express.Router();



router.post("/test-post",testPostController);

module.exports = router;