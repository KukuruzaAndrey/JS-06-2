const okButtonEl = document.querySelector('#ok');
const nameInputEl = document.querySelector('#name');
const nickInputEl = document.querySelector('#nick');
const usersListEl = document.querySelector('#users-list');
const sendButtonEl = document.querySelector('#send');
const userInputEl = document.querySelector('#user-input');
const messagesListEl = document.querySelector('#messages-list');
const typingUsersEl = document.querySelector('#typing');

const ajaxRequest = ({url = '/', method = 'GET', data = {}, callback = (function () {})}) => {
    const xmlHTTP = new XMLHttpRequest();
    xmlHTTP.open(method, url, true);
    xmlHTTP.setRequestHeader('Content-type', 'application/json');
    xmlHTTP.send(JSON.stringify(data));
    xmlHTTP.onreadystatechange = () => {
        if (xmlHTTP.status === 200 && xmlHTTP.readyState === 4) {
            callback(xmlHTTP.responseText);
        }
    };
};

let userName;
let userNick;

okButtonEl.onclick = () => {
    if (nameInputEl.value === '') {
        nameInputEl.style.borderColor = 'red';
        return;
    }
    if (nickInputEl.value === '') {
        nickInputEl.style.borderColor = 'red';
        return;
    }
    document.querySelector('.popup').style.display = 'none';
    userInputEl.removeAttribute('disabled');
    sendButtonEl.removeAttribute('disabled');
    userName = nameInputEl.value;
    userNick = nickInputEl.value;
    const d = new Date();
    const user = {name: userName, nick: userNick, date: `${d.getHours()}:${d.getMinutes()}`};
    ajaxRequest({
        url: '/user',
        method: 'POST',
        data: user
    });
};

const addUser = ({name, nick, date}) => {
    const userEl = document.createElement('li');
    if (nick === userNick) {
        userEl.classList.add('self');
    }
    userEl.classList.add('user');
    const nameEl = document.createElement('p');
    nameEl.innerText = `${name} (@${nick})`;
    userEl.appendChild(nameEl);
    usersListEl.appendChild(userEl);
};
const addMsg = ({name, nick, date, payload}) => {
    const msgEl = document.createElement('li');
    msgEl.classList.add('msg');
    const msgHeaderEl = document.createElement('div');
    msgHeaderEl.classList.add('msg-header');
    const nameEl = document.createElement('p');
    nameEl.classList.add('name');
    nameEl.innerText = name;
    const nickEl = document.createElement('p');
    nickEl.classList.add('nick');
    if (nick === userNick) {
        msgEl.classList.add('self');
    }
    nickEl.innerText = nick;
    const dataEl = document.createElement('p');
    dataEl.classList.add('data');
    dataEl.innerText = date;
    msgHeaderEl.appendChild(nameEl);
    msgHeaderEl.appendChild(nickEl);
    msgHeaderEl.appendChild(dataEl);
    const payloadEl = document.createElement('p');
    const regExp = new RegExp(`@${userNick}`);
    if (regExp.test(payload)) {
        msgEl.classList.add('msg-to-user');
    }
    payloadEl.classList.add('payload');
    payloadEl.innerText = payload;
    msgEl.appendChild(msgHeaderEl);
    msgEl.appendChild(payloadEl);
    messagesListEl.appendChild(msgEl);
};
setInterval(() => {
    ajaxRequest({
        url: '/msg',
        method: 'GET',
        callback: (messages) => {
            messages = JSON.parse(messages);
            while (messagesListEl.firstChild) {
                messagesListEl.removeChild(messagesListEl.firstChild);
            }
            messages.forEach(msg => addMsg(msg));
        }
    });
}, 1000);
setTimeout(() => {
    setInterval(() => {
        ajaxRequest({
            url: '/user',
            method: 'GET',
            callback: (users) => {
                users =JSON.parse(users);
                while (usersListEl.firstChild) {
                    usersListEl.removeChild(usersListEl.firstChild);
                }
                users.forEach(user => addUser(user));
            }
        });
    }, 1000);
}, 500);


const sendMessage = () => {
    if (userInputEl.value === '') {
        return;
    }
    const d = new Date();
    const msg = {
        name: userName,
        nick: userNick,
        date: `${d.getHours()}:${d.getMinutes()}`,
        payload: userInputEl.value
    };
    ajaxRequest({
        url: '/msg',
        method: 'POST',
        data: msg
    });
    userInputEl.value = '';
};
sendButtonEl.onclick = sendMessage;


userInputEl.onkeydown = (e) => {
    if (e.keyCode === 13) {
        sendMessage();
    }
};
