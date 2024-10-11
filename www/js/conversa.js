// Elementos de login
const login = document.querySelector(".login");
const loginForm = login.querySelector(".login__form");
const loginInput = login.querySelector(".login__input");

// Elementos de chat
const chat = document.querySelector(".chat");
const chatForm = chat.querySelector(".chat__form");
const chatInput = chat.querySelector(".chat__input");
const chatMessages = chat.querySelector(".chat__messages");

const colors = [
    "cadetblue",
    "darkgoldenrod",
    "cornflowerblue",
    "darkkhaki",
    "hotpink",
    "gold"
];

let user = { id: "", name: "", color: "" };
let websocket;

// Funções para criar elementos de mensagens
const createMessageSelfElement = (content) => {
    const div = document.createElement("div");
    div.classList.add("message--self");
    div.innerHTML = content;
    return div;
};

const createMessageOtherElement = (content, sender, senderColor) => {
    const div = document.createElement("div");
    const span = document.createElement("span");

    div.classList.add("message--other");

    span.classList.add("message--sender");
    span.style.color = senderColor;

    span.innerHTML = sender;
    div.appendChild(span);

    const messageContent = document.createElement("span");
    messageContent.innerHTML = `: ${content}`;
    div.appendChild(messageContent);

    return div;
};

// Função para obter uma cor aleatória
const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
};

// Função para rolar a tela até o final
const scrollScreen = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    });
};

// Função para processar e exibir mensagens recebidas via WebSocket
const processMessage = ({ data }) => {
    const { userId, userName, userColor, content } = JSON.parse(data);

    const message =
        userId === user.id
            ? createMessageSelfElement(content)
            : createMessageOtherElement(content, userName, userColor);

    chatMessages.appendChild(message);

    scrollScreen();
};

// Função para renderizar mensagens salvas no localStorage
const renderMessages = (messages) => {
    chatMessages.innerHTML = ""; // Limpa a área de mensagens

    messages.forEach(({ content, userName, userColor, userId }) => {
        const messageElement = 
            userId === user.id
                ? createMessageSelfElement(content)
                : createMessageOtherElement(content, userName, userColor);

        chatMessages.appendChild(messageElement);
    });

    scrollScreen();
};

// Função para verificar se o nome já existe e retornar o usuário correspondente
const getExistingUser = (name) => {
    const savedMessages = JSON.parse(localStorage.getItem("chatMessages")) || [];
    const userMessage = savedMessages.find((message) => message.userName === name);
    return userMessage ? { id: userMessage.userId, name: userMessage.userName, color: userMessage.userColor } : null;
};

// Função para manipular o login
const handleLogin = (event) => {
    event.preventDefault();

    const name = loginInput.value;
    const existingUser = getExistingUser(name);

    if (existingUser) {
        // Se o nome já existir, reutilize o ID e a cor do usuário existente
        user = existingUser;
    } else {
        // Se o nome for novo, crie um novo ID e cor
        user.id = crypto.randomUUID();
        user.name = name;
        user.color = getRandomColor();
    }

    login.style.display = "none";
    chat.style.display = "flex";

    websocket = new WebSocket("ws://localhost:8080");
    websocket.onmessage = (e) => {
        processMessage(e);

        // Salvando mensagem no localStorage
        const savedMessages = JSON.parse(localStorage.getItem("chatMessages")) || [];
        const messageData = JSON.parse(e.data);
        savedMessages.push(messageData);
        localStorage.setItem("chatMessages", JSON.stringify(savedMessages));
    };

    // Carregar mensagens salvas no localStorage ao iniciar
    const savedMessages = JSON.parse(localStorage.getItem("chatMessages")) || [];
    renderMessages(savedMessages);
};

// Função para enviar mensagens
const sendMessage = (event) => {
    event.preventDefault();

    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value
    };

    websocket.send(JSON.stringify(message));

    chatInput.value = "";
};

// Eventos
loginForm.addEventListener("submit", handleLogin);
chatForm.addEventListener("submit", sendMessage);