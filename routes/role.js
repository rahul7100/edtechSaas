const roleController = require("../controllers/role");
const userController = require("../controllers/users");
const express = require("express");
const router = express.Router();

router.post("/", roleController.create);
router.get(
  "/",
  userController.requireSignin,
  userController.checkPermissions,
  roleController.getall
);

module.exports = router;
