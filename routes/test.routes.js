const express = require("express");
const testPostController = require("../controllers/test.controller");
const userAuth = require("../middlewares/auth.middleware");

const router = express.Router();


router.post("/test-post",userAuth,testPostController);

module.exports = router;