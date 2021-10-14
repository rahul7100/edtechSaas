const userController = require("../controllers/users");
const express = require("express");
const router = express.Router();

const { check } = require("express-validator");

router.post(
  "/signup",
  [
    check("name").not().isEmpty().withMessage("Name is required"),
    check("email").isEmail().withMessage("Please enter a valid Email"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password should be atleast 6 charecters long"),
  ],
  userController.register
);
router.post(
  "/signin",
  [check("email").isEmail().withMessage("Invalid email")],
  userController.login
);
router.post("/signout", userController.signout);

router.get(
  "/",
  userController.requireSignin,
  userController.checkPermissions,
  userController.getall
);

router.get(
  "/:id",
  userController.requireSignin,
  userController.checkPermissions,
  userController.getsingle
);

router.param("id", userController.userById);

module.exports = router;
