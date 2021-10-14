const schoolSchema = require("../models/school");

exports.create = async (req, res) => {
  try {
    const scope = req.scopes;
    if (scope.includes("school-create")) {
      var schoolObj = {
        name: req.body.name,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
      };
      var name = req.body.name;
      await schoolSchema.findOne({ name }, (err, result) => {
        if (err) {
          throw err;
        } else {
          if (!result) {
            const school = new schoolSchema(schoolObj);
            school.save((err, result) => {
              if (err) {
                res.status(404).json(err);
              } else {
                res.json(result);
              }
            });
          } else {
            res.json({ msg: "School with this name already exists" });
          }
        }
      });
    } else {
      res.json({ msg: "Access Denied! Out of scope" });
    }
  } catch (err) {
    throw err;
  }
};

exports.getall = async (req, res) => {
  try {
    const scope = req.scopes;
    if (scope.includes("school-get")) {
      await schoolSchema.find(
        {},
        "name city state country createdAt updatedAt",
        (err, result) => {
          if (err) {
            throw err;
          } else {
            res.json(result);
          }
        }
      );
    } else {
      res.json({ msg: "Access Denied" });
    }
  } catch {
    throw err;
  }
};

exports.getschoolstudents = async (req, res) => {
  try {
    const scope = req.scopes;
    if (scope.includes("school-students")) {
      await schoolSchema
        .find({}, "name city state country students")
        .populate("students")
        .exec()
        .then((result) => {
          res.json(result);
        });
    } else {
      res.json({ msg: "Access Denied" });
    }
  } catch {
    throw err;
  }
};
