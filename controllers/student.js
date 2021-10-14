const studentSchema = require("../models/student");
const schoolSchema = require("../models/school");
const Student = require("../models/student");

exports.create = async (req, res) => {
  try {
    var studentObj = {
      name: req.body.name,
      userId: req.body.userId,
      schoolId: req.body.schoolId,
    };
    var userId = req.body.userId;
    await studentSchema.findOne({ userId }, async (err, result) => {
      if (err) {
        throw err;
      } else {
        if (!result) {
          const student = new studentSchema(studentObj);
          console.log(student._id);
          var id = student._id;
          await schoolSchema.findOne(
            { _id: studentObj.schoolId },
            (err, result1) => {
              if (err) {
                throw err;
              } else {
                if (!result1) {
                  return res.json({ msg: "School Id incorrect" });
                } else {
                  result1.students.push(id);
                  result1.save((err, _resultschool) => {
                    if (err) {
                      throw err;
                    } else {
                      student.save((err, result) => {
                        if (err) {
                          res.status(404).json(err);
                        } else {
                          res.json(result);
                        }
                      });
                    }
                  });
                }
              }
            }
          );
        } else {
          res.json({ msg: "Student with this Id already exists" });
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
    if (scope.includes("student-get")) {
      await studentSchema.find({}, (err, result) => {
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
