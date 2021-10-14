const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
require("dotenv").config();
const connectionString = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.bu794.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const roleRoutes = require("./routes/role");
const userRoutes = require("./routes/users");
const schoolRoutes = require("./routes/school");
const studentRoutes = require("./routes/student");

const cors = require("cors");
const app = express();
const port = process.env.PORT || 8000;

const initializeMongo = async () => {
  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log("Database connected");
  } catch (err) {
    throw err;
  }
};

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res, next) => {
  res.json({ msg: "welcome" });
  next();
});
app.use("/user", userRoutes);
app.use("/role", roleRoutes);
app.use("/school", schoolRoutes);
app.use("/student", studentRoutes);

app.listen(port, () => {
  console.log("server is running");
  initializeMongo();
});
