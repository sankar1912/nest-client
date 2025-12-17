import { io } from "socket.io-client";

export const socket = io("https://nest-chat-server-d01j.onrender.com", {
  transports: ["websocket"],
});
