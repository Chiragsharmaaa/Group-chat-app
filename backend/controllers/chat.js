const Chat = require("../models/chats");
const User = require("../models/user");

exports.postMessage = async (req, res, next) => {
  const { message } = req.body;
  const groupId = req.params.groupId;
  try {
    if (!message || !groupId) {
      return res.status(400).json({
        message: "nothing entered!",
      });
    }
    const data = await req.user.createChat({
      message,
      groupId,
    });
    const arr = [];
    const details = {
      id: data.id,
      groupId: data.groupId,
      name: req.user.name,
      message: data.message,
      createdAt: data.createdAt,
    };
    arr.push(details);
    res.status(201).json({
      arr,
      message: "Message added to db!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to send messages!",
    });
  }
};

exports.getMessage = async (req, res, next) => {
  let msgId = req.query.lastmsgid;
  const groupId = req.params.groupId;

  try {
    const data = await Chat.findAll({
      where: {
        groupId
      },
    });
    let index = data.findIndex((chat) => chat.id == msgId);
    let msgtosend = data.slice(index + 1);
    let arr = [];
    for (let i = 0; i < msgtosend.length; i++) {
      const user = await User.findByPk(msgtosend[i].userId);
      const details = {
        id: msgtosend[i].id,
        groupId: msgtosend[i].groupId,
        name: user.name,
        message: msgtosend[i].message,
        createdAt: msgtosend[i].createdAt,
      };
      arr.push(details);
    }
    res.status(200).json({
      arr,
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to retrieve chats!",
    });
  }
};
