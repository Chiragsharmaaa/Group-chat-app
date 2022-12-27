const token = localStorage.getItem("userToken");

const chatList = document.getElementById('chat');
const form = document.getElementById("chat-form");

form.addEventListener("submit", chatFxn);

window.addEventListener('DOMContentLoaded', screenLoader);

async function screenLoader(e) {
    e.preventDefault();

    try {
        const response = await axios.get('http://localhost:3000/user/getmessage', {
            headers: {
                "Authorization": token
            }
        });
        showChatOnScreen(response.data, response.data.username);
    } catch (error) {
        console.log('Unable to retrieve messages!', error)
    };
};

function showChatOnScreen(data, name) {
    localStorage.setItem('name', name);
    data.data.forEach(chat => {
        showChats(chat, name);
    });
};

function showChats(chat, name) {
    let child = `<li class="me">
    <div class="entete">
      <h3>${new Date().toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit', hour12:true}) + ' , ' + new Date().toDateString()}</h3>
      <h2>${name.split(' ')[0]}</h2>
      <span class="status blue"></span>
    </div>
    <div class="triangle"></div>
    <div class="message">
      ${chat.message}
    </div>
  </li>`;

    chatList.innerHTML += child;
}

async function chatFxn(e) {
    e.preventDefault();

    const message = {
        message: e.target.message.value,
    };
    console.log(message);

    try {
        const response = await axios.post(
            "http://localhost:3000/user/postmessage",
            message, {
                headers: {
                    "Authorization": token
                }
            }
        );
        e.target.message.value = "";
        showOnScreen(message);
    } catch (error) {
        console.log(error);
    };
};

function showOnScreen(chat) {
    const name = localStorage.getItem('name');

    let child = `<li class="me">
    <div class="entete">
      <h3>${new Date().toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit', hour12:true}) + ' , ' + new Date().toDateString()}</h3>
      <h2>${name.split(' ')[0]}</h2>
      <span class="status blue"></span>
    </div>
    <div class="triangle"></div>
    <div class="message">
      ${chat.message}
    </div>
  </li>`

    chatList.innerHTML += child;
}