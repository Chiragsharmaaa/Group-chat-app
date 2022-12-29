const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const sequelize = require("./utils/database");

const User = require("./models/user");
const Chat = require("./models/chats");
const Group = require("./models/group");
const UserGroup = require("./models/usergroup");

const userRouter = require("./routes/user");
const messageRouter = require("./routes/message");
const groupRouter = require("./routes/group");

const app = express();

app.use(express.json());
app.use(bodyParser.json({
  extended: false
}));
app.use(
  cors({
    origin: "*",
  })
);

Chat.belongsTo(User);
User.hasMany(Chat);
Group.hasMany(Chat);
Chat.belongsTo(Group);
User.belongsToMany(Group, {
  through: UserGroup
});
Group.belongsToMany(User, {
  through: UserGroup
});

app.use("/user", userRouter);
app.use("/message", messageRouter);
app.use("/group", groupRouter);

sequelize
  .sync()
  .then(() => {
    app.listen(process.env.PORT || 3000),
      () => {
        console.log("Database initialized!");
      };
  })
  .catch((err) => {
    console.log(err);
  });