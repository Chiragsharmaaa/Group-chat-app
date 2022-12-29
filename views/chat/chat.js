const token = localStorage.getItem("userToken");
const User = localStorage.getItem("name");
const groupId = localStorage.getItem("groupId");
const groupName = localStorage.getItem("groupName");

const chatList = document.getElementById("chat");
const form = document.getElementById("chat-form");
const groupDiv = document.getElementById("group");

form.addEventListener("submit", chatFxn);

let lastMsgId;
let chatArr = [];

window.addEventListener("DOMContentLoaded", screenLoader);

async function screenLoader(e) {
  e.preventDefault();
  document.getElementById("username").innerHTML = groupName;
  getMessage(groupId);
  getUsers(groupId);
}

async function getMessage(groupId) {
  const messages = JSON.parse(localStorage.getItem(`msg${groupId}`));
  if (messages == undefined || messages.length == 0) {
    lastMsgId = 0;
  } else {
    lastMsgId = messages[messages.length - 1].id;
  }

  try {
    const response = await axios.get(
      `http://localhost:3000/message/getmessage/${groupId}?lastmsgid=${lastMsgId}`,
      {
        headers: {
          "Authorization": token,
        },
      }
    );
    var newArray = response.data.arr;
    saveToLocal(newArray);
  } catch (error) {
    console.log("Unable to retrieve messages!", error);
  }
}

async function getUsers(groupId) {
  try {
    let response = await axios.get(
      `http://localhost:3000/group/fetch-users/${groupId}`,
      { headers: { "Authorization": token } }
    );
    console.log(response)
    response.data.forEach((data) => displayGroupUsers(data));
  } catch (error) {
    console.log(error);
  }
}

function displayGroupUsers(data) {
  console.log('data', data)
  let child = `<li>
    <img src="#" alt="" />
    <div>
      <h2>${data.name}</h2>
    </div>
    </li>`;
  console.log(child)
  groupDiv.innerHTML += child;
}

function saveToLocal(arr) {
  let oldMessages = JSON.parse(localStorage.getItem(`msg${groupId}`));
  if (oldMessages == undefined || oldMessages.length == 0) {
    chatArr = chatArr.concat(arr);
  } else {
    chatArr = [];
    chatArr = chatArr.concat(oldMessages, arr);
  }
  localStorage.setItem(`msg${groupId}`, JSON.stringify(chatArr));
  showChatOnScreen();
}

function showChatOnScreen() {
  chatList.innerHTML = "";
  chatArr.forEach((chat) => {
    if (User == chat.name) {
      let child = `<li class="me" id=${chat.id}>
      <div class="entete">
        <h3>${new Date(Date.parse(chat.createdAt)).toLocaleString([], {
        timezone: "IST",
        hour12: true,
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })}
      </h3>
        <h2>${chat.name}</h2>
        <span class="status blue"></span>
      </div>
      <div class="triangle"></div>
      <div class="message">
        ${chat.message}
      </div>
    </li>`;

      chatList.innerHTML += child;
    } else {
      let child = `<li class="you" id=${chat.id}>
      <div class="entete">
        <h3>${new Date(Date.parse(chat.createdAt)).toLocaleString([], {
        timezone: "IST",
        hour12: true,
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })}
      </h3>
        <h2>${chat.name}</h2>
        <span class="status blue"></span>
      </div>
      <div class="triangle"></div>
      <div class="message">
        ${chat.message}
      </div>
    </li>`;

      chatList.innerHTML += child;
    }
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
      `http://localhost:3000/message/postmessage/${groupId}`,
      message,
      {
        headers: {
          "Authorization": token,
        },
      }
    );
    e.target.message.value = "";
    saveToLocal(response.data.arr);
  } catch (error) {
    console.log(error);
  }
}

document.getElementById("logout").onclick = function (e) {
  localStorage.removeItem("userToken");
  localStorage.removeItem("msg");
  localStorage.removeItem("name");
  window.location.href = "../login/login.html";
};
