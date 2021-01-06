import { Request, Response } from "express";
import { Socket } from "socket.io";
import { MessageParam, SQuery } from "./typing/ChatRoom";
require("dotenv").config();

const PORT = process.env.PORT || 5000;

var app = require("express")();
var cors = require("cors");

const CORS_WHITE_LIST = [
  "http://localhost:3000",
  "http://localhost:5000",
  "https://vigilant-babbage-eab9be.netlify.app",
  "https://boiling-fjord-85810.herokuapp.com/",
];
app.use(
  cors({
    origin: function (origin: any, callback: any) {
      if (CORS_WHITE_LIST.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.get("/", function (req: Request, res: Response) {
  res.json({}).status(200);
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

var http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*:*",
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
