exports.postMessage = async (req, res, next) => {
    const {
        message
    } = req.body;
    try {
        if (!message) {
            return res.status(400).json({
                message: "nothing entered!"
            });
        }
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
    }
};

exports.getMessage = async (req, res, next) => {
    try {
        const data = await req.user.getChats();
        let username = req.user.name;
        res.status(200).json({
            data,
            username
        })
    } catch (error) {
        res.status(500).json({
            message: "Unable to retrieve chats!"
        })
    }


}