const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schoolSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
  },
  { timestamps: true }
);

const School = mongoose.model("School", schoolSchema);
module.exports = School;
