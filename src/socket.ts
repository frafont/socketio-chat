import { io, Socket } from "socket.io-client";

// Configura la connessione al server WebSocket
const socket: Socket = io("ws://localhost:3001"); // Modifica con l'URL del tuo server

// Gestisci la connessione
socket.on("connect", () => {
  console.log(`Connesso al server con ID: ${socket.id}`);
});

// Funzione per inviare i dati dell'utente al server
export const sendUserData = (userData: { name: string; email: string }) => {
  socket.emit("userData", userData); // Invia i dati al server

  //Gestisci la risposta dal server
  socket.on("chatCreated", (chatId: string) => {
    console.log(`Chat creata con ID: ${chatId}`);
    sessionStorage.setItem("chatId", chatId);
  });

  socket.on("userDataError", (error: { message: string; error: string }) => {
    console.error("Errore durante la creazione dell'utente:", error);
  });
};

// Funzione per inviare un messaggio alla chat
export const sendMessage = (message: string, chatId: string) => {
  socket.emit("user message", message, chatId);

  // Gestisci la risposta dal server
  socket.on(
    "messageReceived",
    (response: { status: string; message: string }) => {
      if (response.status === "success") {
        console.log(`Messaggio inviato con successo: ${response.message}`);
      }
    }
  );

  socket.on("messageError", (error: { message: string; error: string }) => {
    console.error("Errore nel salvataggio del messaggio:", error);
  });
};

// Funzione per gestire la disconnessione
export const disconnectUser = (chatId: string) => {
  socket.emit("disconnect", chatId);

  socket.on("disconnect", () => {
    console.log("Utente disconnesso");
  });
};
