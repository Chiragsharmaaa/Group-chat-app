const token = localStorage.getItem("userToken");

const form = document.getElementById("chat-form");
form.addEventListener("submit", chatFxn);

async function chatFxn(e) {
    e.preventDefault();

    const message = {
        message: e.target.message.value,
    };
    console.log(message);

    try {
        const response = await axios.post(
            "http://localhost:3000/user/message",
            message, {
                headers: {
                    "Authorization": token
                }
            }
        );
        e.target.message.value = "";
    } catch (error) {
        console.log(error);
    }
}