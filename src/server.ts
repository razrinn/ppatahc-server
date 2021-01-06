import { NextFunction, Request, Response } from "express";
import { Socket } from "socket.io";
import { MessageParam, SQuery } from "./typing/ChatRoom";
require("dotenv").config();

const PORT = process.env.PORT || 5000;

var app = require("express")();

app.use(function (req: Request, res: Response, next: NextFunction) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

app.get("/", function (req: Request, res: Response) {
  res.json({}).status(200);
});

var http = require("http").Server(app);
const io = require("socket.io")(http);

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

http.listen(PORT, () => console.log(`Listening on ${PORT}`));
