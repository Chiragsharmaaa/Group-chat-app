//get all key-values from localstorage!
const token = localStorage.getItem("userToken");
const User = localStorage.getItem("name");
const groupId = localStorage.getItem("groupId");
const groupName = localStorage.getItem("groupName");
const admin = JSON.parse(localStorage.getItem('isAdmin'));

const chatList = document.getElementById("chat");
const form = document.getElementById("chat-form");
const groupDiv = document.getElementById("group");

//fxn running when a user sends a chat!
form.addEventListener("submit", chatFxn);

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
  };
};
let lastMsgId;
let chatArr = [];

window.addEventListener("DOMContentLoaded", screenLoader);

//default fxn!
async function screenLoader(e) {
  e.preventDefault();
  document.getElementById("groupname").innerHTML = groupName;
  document.getElementById("username").innerHTML = `<small class="grp-user">Hey! </small> ${User}`;
  isAdmin(groupId);
  getMessage(groupId);
  getUsers(groupId);
  if (admin) {
    document.getElementById('add-user').classList.add('admin');
  };
};

//checker fxn for admin rights!
async function isAdmin(groupId) {
  try {
    let response = await axios.get(`http://localhost:3000/group/isAdmin/${groupId}`, { headers: { "Authorization": token } });
    localStorage.setItem('isAdmin', response.data);
    if (JSON.parse(localStorage.getItem('isAdmin'))) {
      document.getElementById('add-user').classList.add('admin');
    }
  } catch (error) {
    console.log(error);
  };
};

//get msgs from local storage!
async function getMessage(groupId) {
  const messages = JSON.parse(localStorage.getItem(`msg${groupId}`));
  if (messages == undefined || messages.length == 0) {
    lastMsgId = 0;
  } else {
    lastMsgId = messages[messages.length - 1].id;
  };

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
  };
};

// retrieve users in group on side bar! 
async function getUsers(groupId) {
  try {
    let response = await axios.get(
      `http://localhost:3000/group/fetch-users/${groupId}`,
      { headers: { "Authorization": token } }
    );
    let admin = JSON.parse(localStorage.getItem('isAdmin'));
    if (admin) {
      response.data.forEach((data) => displayGroupAdminUser(data));
    } else {
      response.data.forEach(data => displayNormalUsers(data));
    };
  } catch (error) {
    console.log(error);
  }
}

// display admin user!
function displayGroupAdminUser(data) {
  let child = `<div  class="group-style" id=${data.id}>
  <div class="user-btn">${data.name}</div>
  <div class="admin-buttons">
  <a href="http://127.0.0.1:5500/views/chat/chat.html" class="add-user btn btn-sm btn-secondary rounded-5" onclick="makeAdmin('${data.id}'); window.location.reload(true); return false;" data-toggle="tooltip" title="Add Admin">&#9889</a>
  <a class="remove-admin btn btn-sm btn-secondary rounded-5" onclick="removeAdmin('${data.id}')" data-toggle="tooltip" title="Remove Admin">&#9940</a>
  <a class="remove-user btn btn-sm btn-secondary rounded-5" onclick="removeUser('${data.id}')" data-toggle="tooltip" title="Remove User">&#128683</a>
  </div> 
</div>
<hr/>`;

  groupDiv.innerHTML += child;
}

//display normal users!
function displayNormalUsers(data) {
  let child = `<div style="width:100%;color:white" class="group-style" id=${data.id}>
  <button class="user-btn">${data.name}</button>
  <div class="admin-buttons">
  <a class="remove-user btn btn-sm btn-secondary rounded-5" onclick="removeUser('${data.id}')" data-toggle="tooltip" title="Remove User">&#128683</a>
  </div>
</div>
<br/>
<hr style="color:white;"/>`

  groupDiv.innerHTML += child;
}

//remove user from db!
async function removeUser(userId) {
  const details = {
    userId,
    groupId
  };
  try {
    let response = await axios.post('http://localhost:3000/group/remove-user', details, { headers: { "Authorization": token } });
    alert('User removed Successfully!');
    removeUserFromScreen(response.data.user);
  } catch (error) {
    if (error.response.status == 402) {
      alert('Only Admin has delete rights!');
    } else if (error.response.status == 404) {
      alert('no group or user found!');
    } else {
      alert('unknown error occured! Cannot change admin rights.');
    };
  };
};

//remove user from front end side bar!
function removeUserFromScreen(user) {
  const child = document.getElementById(`${user.id}`);
  groupDiv.removeChild(child);
}

//make and remove admin rights
async function makeAdmin(userId) {
  const details = {
    userId,
    groupId
  };
  console.log(details)
  try {
    let response = await axios.post(`http://localhost:3000/group/makeAdmin`, details, { headers: { "Authorization": token } });
    alert('User is Admin now!');
  } catch (error) {
    console.log(error, { message: 'unknown error occurred! Cannot change admin rights.' });
  }
}

async function removeAdmin(userId) {
  const details = {
    userId,
    groupId
  };
  try {
    let response = await axios.post('http://localhost:3000/group/removeAdmin', details, { headers: { "Authorization": token } });
    alert('Removed Admin rights from User!');
  } catch (error) {
    console.log(error, { message: 'Cannot make admin! Error occurred' });
  }
}
// -==================================================================================================================================-

//function for user search box on side bar!
document.getElementById('form-group').onsubmit = async function (e) {
  e.preventDefault();
  console.log(e.target.email.value)
  const details = {
    email: e.target.email.value,
    groupId: groupId
  };

  try {
    let response = await axios.post('http://localhost:3000/group/addUser', details, { headers: { "Authorization": token } });
    displayGroupAdminUser(response.data.user);
    alert('User added to group successfully!');
    document.querySelector('.groupName').value = '';
  } catch (error) {
    if (error.response.status == 401) {
      alert("User already in group!");
    } else if (error.response.status == 400) {
      alert("Enter Mail!");
    } else if (error.response.data == 404) {
      alert("User not found!")
    } else {
      alert('Unknown error occurred!');
    };
  };
};

//save messages in an array on local storage!
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

//function to display chat on screen!
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
        <h2>You</h2>
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

//Logout function!
document.getElementById("logout").onclick = function (e) {
  localStorage.removeItem("userToken");
  localStorage.removeItem("msg");
  localStorage.removeItem("name");
  window.location.href = "../login/login.html";
};
