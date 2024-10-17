// Elementos de chat
const chat = document.querySelector(".chat");
const chatForm = chat.querySelector(".chat__form");
const chatInput = chat.querySelector(".chat__input");
const chatMessages = chat.querySelector(".chat__messages");

let user = { id: "user1", name: "Usuário Exemplo", color: "black" }; // Exemplo de usuário

let websocket = new WebSocket("ws://localhost:8080"); // Altere para a URL do seu WebSocket

// Função para enviar mensagens
const sendMessage = (event) => {
    event.preventDefault(); // Impede o comportamento padrão do formulário

    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value
    };

    websocket.send(JSON.stringify(message));
    chatInput.value = ""; // Limpa o campo de entrada
};

// Evento de envio do formulário
chatForm.addEventListener("submit", sendMessage);

// Aqui você pode adicionar o restante do seu código para processar mensagens recebidas
