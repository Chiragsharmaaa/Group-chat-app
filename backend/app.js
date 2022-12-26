const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./utils/database");
require("dotenv").config();

const User = require("./models/user");
const userRouter = require("./routes/user");

const app = express();

app.use(express.json());
app.use(bodyParser.json({ extended: false }));
app.use(
  cors({
    origin: "*",
  })
);

app.use("/user", userRouter);

sequelize
  .sync({ force: true })
  .then(() => {
    app.listen(process.env.PORT),
      () => {
        console.log("Database initialized!");
      };
  })
  .catch((err) => {
    console.log(err);
  });
