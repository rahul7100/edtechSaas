const userModel = require("../models/users");
const roleModel = require("../models/role");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const exp_jwt = require("express-jwt");

//FOR REGISTRATION
exports.register = async (req, res) => {
  try {
    var userObj = {
      name: req.body.name,
      email: req.body.email,
    };
    if (req.body.roleId) {
      userObj.roleId = req.body.roleId;
    }
    if (req.body.mobile) {
      userObj.mobile = req.body.mobile;
    }
    var email = req.body.email;
    var password = req.body.password;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json(errors);
    } else {
      await userModel.findOne({ email }, (err, userResult) => {
        if (err) throw err;
        else {
          if (!userResult) {
            bcrypt.hash(password, 10, (err, hash_pass) => {
              if (err) throw err;
              else {
                userObj.password = hash_pass;
                const user = new userModel(userObj);
                user.save((err, result) => {
                  if (err) {
                    res.status(404).json(err);
                  } else {
                    res.json(result);
                  }
                });
              }
            });
          } else {
            res.json({ msg: "user already exists" });
          }
        }
      });
    }
  } catch (err) {
    throw err;
  }
};

//FOR LOGIN
exports.login = async (req, res) => {
  try {
    var email = req.body.email;
    var password = req.body.password;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json(errors);
    } else {
      await userModel.findOne({ email }, async (err, userResult) => {
        if (err) {
          res.status(400).json("Something Went Wrong");
        } else {
          if (!userResult) {
            res.json({ msg: "USER DOESNOT EXIST" });
          } else {
            if (await bcrypt.compare(password, userResult.password)) {
              const token = jwt.sign(
                { _id: userResult._id, userResult },
                process.env.JWT_SECRET,
                { expiresIn: "2 days" }
              );
              res.cookie("t", token, { expiresIn: "2  days" });
              res.json({ token, userResult });
            } else {
              res.json({ msg: "Invalid Email or Password!!!" });
            }
          }
        }
      });
    }
  } catch (err) {
    throw err;
  }
};

//FOR SIGNOUT

exports.signout = async (req, res, next) => {
  try {
    res.clearCookie("t");
    res.json({ msg: "SIGNOUT SUCCESSFUL" });
  } catch (err) {
    throw err;
  }
};

exports.requireSignin = exp_jwt({
  secret: process.env.JWT_SECRET,
  userProperty: "user",
  algorithms: ["HS256"],
});

exports.userById = async (req, res, next, id) => {
  try {
    console.log("userid");
    await userModel.findById({ _id: id }, (err, user) => {
      if (err) {
        throw err;
      } else {
        if (!user) {
          res.json({ msg: "user not found" });
        } else {
          req.profile = user;
          // console.log(req.profile, "profile key");
          next();
        }
      }
    });
  } catch (err) {
    throw err;
  }
};

exports.isAuth = (req, res, next) => {
  // console.log(req.user, " user key");
  let user = req.profile && req.user && req.profile._id == req.user._id;
  if (!user) {
    return res.status(403).json({ error: "Access Denied" });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({ error: "Admin resourse! Access denied" });
  }
  next();
};

exports.checkPermissions = async (req, res, next) => {
  var userid = req.user._id;
  console.log("check");
  await userModel
    .findOne({ _id: userid })
    .populate("roleId")
    .exec()
    .then((result) => {
      req.scopes = result.roleId.scopes;
      next();
    });
};

exports.getall = async (req, res) => {
  try {
    const scope = req.scopes;
    if (scope.includes("user-get")) {
      await userModel.find({}, (err, result) => {
        if (err) {
          throw err;
        } else {
          res.json(result);
        }
      });
    } else {
      res.json({ msg: "Access Denied" });
    }
  } catch (err) {
    throw err;
  }
};

exports.getsingle = async (req, res) => {
  try {
    const scope = req.scopes;
    if (scope.includes("user-get")) {
      res.json(req.profile);
    } else {
      res.json({ msg: "Access Denied" });
    }
  } catch (err) {
    throw err;
  }
};
