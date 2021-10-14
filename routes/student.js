const studentController = require("../controllers/student");
const userController = require("../controllers/users");
const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

router.post(
  "/",
  userController.requireSignin,
  userController.checkPermissions,
  studentController.create
);
router.get(
  "/",
  userController.requireSignin,
  userController.checkPermissions,
  studentController.getall
);

module.exports = router;
