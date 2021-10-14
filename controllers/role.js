const roleSchema = require("../models/role");

exports.create = async (req, res) => {
  try {
    var roleObj = { name: req.body.name, scopes: req.body.scopes };
    var name = req.body.name;
    await roleSchema.findOne({ name }, (err, result) => {
      if (err) {
        throw err;
      } else {
        if (!result) {
          const role = new roleSchema(roleObj);
          role.save((err, result) => {
            if (err) {
              res.status(404).json(err);
            } else {
              res.json(result);
            }
          });
        } else {
          res.json({ msg: "Role with this name already exists" });
        }
      }
    });
  } catch (err) {
    throw err;
  }
};

exports.getall = async (req, res) => {
  try {
    const scope = req.scopes;
    if (scope.includes("role-get")) {
      await roleSchema.find({}, (err, result) => {
        if (err) {
          throw err;
        } else {
          res.json(result);
        }
      });
    } else {
      res.json({ msg: "Access Denied" });
    }
  } catch {
    throw err;
  }
};
