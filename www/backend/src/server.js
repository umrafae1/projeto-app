const { WebSocketServer } = require("ws");
const dotenv = require("dotenv");

dotenv.config();

const wss = new WebSocketServer({ port: process.env.PORT || 8080 });

wss.on("connection", (ws) => {
    ws.on("error", (error) => {
        console.error("WebSocket error:", error);
    });

    ws.on("message", (data) => {
        // Certifique-se de que todos os clientes ainda estão conectados antes de enviar mensagens
        wss.clients.forEach((client) => {
            if (client.readyState === client.OPEN) {
                client.send(data.toString(), (error) => {
                    if (error) {
                        console.error("Error sending message:", error);
                    }
                });
            }
        });
    });

    console.log("Client connected");

    ws.on("close", () => {
        console.log("Client disconnected");
    });
});

// Log quando o servidor estiver em execução
console.log(`WebSocket server is running on ws://localhost:${process.env.PORT || 8080}`);
