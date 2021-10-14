const schoolController = require("../controllers/school");
const userController = require("../controllers/users");
const express = require("express");
const router = express.Router();

router.post("/", schoolController.create);
router.get(
  "/",
  userController.requireSignin,
  userController.checkPermissions,
  schoolController.getall
);
router.get(
  "/students",
  userController.requireSignin,
  userController.checkPermissions,
  schoolController.getschoolstudents
);

module.exports = router;
