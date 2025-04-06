import { generateNavigatorComponent } from './src/navigator.js';

const navigator = generateNavigatorComponent(document.getElementById("container"));

const input = document.getElementById("input");
const button = document.getElementById("sendButton");
const chat = document.getElementById("chat");

const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
const submitButtonLogin = document.getElementById("submitButtonLogin");

const template = "<li class=\"list-group-item\">%MESSAGE</li>";
const messages = [];

const socket = io();

location.href = "#loginPage";

submitButtonLogin.onclick = () => {
    let username = document.getElementById('usernameInput').value;
    if (username === "") {
        document.querySelector('#divError').classList.remove("hidden");
    } else {
        document.getElementById('usernameInput').value = "";
        location.href = "#chatPage";
        loginModal.hide();
        socket.emit("setUsername", username);
    }
}

input.onkeydown = (event) => {
    if (event.keyCode === 13) {
        event.preventDefault();
        button.click();
    }
};

button.onclick = () => {
    socket.emit("message", input.value);
    input.value = "";
};

socket.on("chat", (message) => {
    console.log(message);
    messages.push(message);
    render();
});

const render = () => {
    let html = "";
    messages.forEach((message) => {
        const row = template.replace("%MESSAGE", message);
        html += row;
    });
    chat.innerHTML = html;
    window.scrollTo(0, document.body.scrollHeight);
};
