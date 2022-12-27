const token = localStorage.getItem("userToken");
const User = localStorage.getItem('name');

const chatList = document.getElementById('chat');
const form = document.getElementById("chat-form");

form.addEventListener("submit", chatFxn);

let lastMsgId;
let chatArr = [];

window.addEventListener('DOMContentLoaded', screenLoader);

async function screenLoader(e) {
    e.preventDefault();
    const messages = JSON.parse(localStorage.getItem('msg'));
    if (messages == undefined || messages.length == 0) {
        lastMsgId = 0;
    } else {
        lastMsgId = messages[messages.length - 1].id;
    };

    try {
        const response = await axios.get(`http://localhost:3000/user/getmessage?lastmsgid=${lastMsgId}`, {
            headers: {
                "Authorization": token
            }
        });
        console.log("Response", response)
        var newArray = response.data.msgtosend;
        saveToLocal(newArray, response.data.username);
    } catch (error) {
        console.log('Unable to retrieve messages!', error)
    };

};

function saveToLocal(arr, name) {
    let oldMessages = JSON.parse(localStorage.getItem('msg'));
    if (oldMessages == undefined || oldMessages.length == 0) {
        chatArr = chatArr.concat(arr);
    } else {
        chatArr = [];
        chatArr = chatArr.concat(oldMessages, arr)
    };
    localStorage.setItem('msg', JSON.stringify(chatArr));
    showChatOnScreen(name);
}

function showChatOnScreen(name) {
    chatList.innerHTML = ''
    localStorage.setItem('name', name);
    chatArr.forEach(chat => {
        let child = `<li class="me" id=${chat.id}>
    <div class="entete">
      <h3>${(new Date(Date.parse(chat.createdAt))).toLocaleString('en-US',
      {timeZone:'UTC',hour12:true}
    )}</h3>
      <h2>${name.split(' ')[0]}</h2>
      <span class="status blue"></span>
    </div>
    <div class="triangle"></div>
    <div class="message">
      ${chat.message}
    </div>
  </li>`;

        chatList.innerHTML += child;
    });
    document.getElementById(`${lastMsgId}`).scrollIntoView();
}

async function chatFxn(e) {
    e.preventDefault();

    const message = {
        message: e.target.message.value,
    };

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
        let name = localStorage.getItem('name')
        saveToLocal(response.data.data, name);
        // showOnScreen(message);
    } catch (error) {
        console.log(error);
    };
};

// function showOnScreen(chat) {
//     const name = localStorage.getItem('name');

//     let child = `<li class="me">
//     <div class="entete">
//       <h3>${new Date().toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit', hour12:true}) + ' , ' + new Date().toDateString()}</h3>
//       <h2>${name.split(' ')[0]}</h2>
//       <span class="status blue"></span>
//     </div>
//     <div class="triangle"></div>
//     <div class="message">
//       ${chat.message}
//     </div>
//   </li>`

//     chatList.innerHTML += child;
// }

document.getElementById('logout').onclick = function (e) {
    localStorage.removeItem('userToken');
    localStorage.removeItem('msg');
    localStorage.removeItem('name');
    window.location.href = '../login/login.html';
}