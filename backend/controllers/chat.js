exports.postMessage = async (req, res, next) => {
    const {
        message
    } = req.body;
    try {
        if (!message) {
            return res.status(400).json({
                message: "nothing entered!"
            });
        };
        const data = await req.user.createChat({
            message
        });
        res.status(201).json({
            data,
            message: "Message added to db!"
        });
    } catch (error) {
        res.status(500).json({
            message: "Unable to send messages!"
        });
    };
};

exports.getMessage = async (req, res, next) => {
    let msgId = req.query.lastmsgid;
    try {
        const data = await req.user.getChats();
        let index = data.findIndex(chat => chat.id == msgId)
        let msgtosend = data.slice(index + 1);
        let username = req.user.name;
        res.status(200).json({
            msgtosend,
            username
        });
    } catch (error) {
        res.status(500).json({
            message: "Unable to retrieve chats!"
        });
    };
};