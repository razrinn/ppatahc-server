import { Socket } from "socket.io";
import { MessageParam, SQuery } from "./typing/ChatRoom";

require("dotenv").config();

const PORT = process.env.ENV_SOCKET_PORT || 5000;
const CLIENT_HOST = process.env.ENV_CLIENT_HOST || "http://localhost:3000";

const io = require("socket.io")(PORT, {
  cors: {
    origin: CLIENT_HOST,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket: Socket) => {
  const { id }: SQuery = socket.handshake.query;
  if (id) {
    socket.join(id);
    socket.on("send-message", ({ recipients, text }: MessageParam) => {
      recipients.forEach((recipient) => {
        const newRecipients = recipients.filter((r) => r.id !== recipient.id);
        newRecipients.push({ id: id });
        socket.broadcast.to(recipient.id).emit("receive-message", {
          recipients: newRecipients,
          sender: id,
          text,
        });
      });
    });
  }
});
