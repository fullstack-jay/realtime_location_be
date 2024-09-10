import http from "http";
import express from "express";
import { connectDB } from "./database/config";
import * as dotenv from "dotenv";
import { Server, Socket } from "socket.io";
import routes from "./restful/routes";
import cors from "cors";
import User from "./@types/user";
import {
  getCurrentUser,
  getRoomUsers,
  userJoin,
  userLeave,
} from "./utils/users";


dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());

// Default Home
app.get("/", (req, res) => {
  res.json({
    message: "Selamat data di aplikasi infra location!",
  });
});

app.use("/api/v1/", routes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Running when user connects
io.on("connection", (socket: Socket) => {
  socket.on("joinRoom", (data) => {
    const user: User = userJoin({
      id: data.user,
      username: data.username,
      room: data.room,
      img: data.profileUrl,
      joinedAt: new Date(),
    });

    socket.join(user.room);

    //Welcome user
    socket.emit("terhubung", "Anda terhubung dengan perjalanan ini");
    socket.broadcast
      .to(user.room)
      .emit("terhubung", `${user.username} telah bergabung dalam gerakan ini`);

    socket.on("locationChanged", (data) => {
      const { user, lat, long } = data;
      const userA = getCurrentUser(user);

      if (!userA) return;

      io.to(userA.room).emit("locationChanged", {
        user: userA.id,
        lat,
        long,
      });
    });
    //Chatting message
    socket.on("chatMessage", (data) => {
      const { userId, message } = data;

      const userA = getCurrentUser(userId);

      if (!userA) return;

      io.to(userA.room).emit("chatMessage", {
        userId,
        message,
        sentAt: new Date(),
      });
    });
    //Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });

    //Runs when clients disconnect
    socket.on("tidak terhubung", () => {
      const leavingUser = userLeave(user.id);
      if (!leavingUser) return;
      io.to(leavingUser.room).emit(
        "terhubung",
        `${leavingUser.username} telah meninggalkan perjalanan`
      );
      //Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    });
  });
});

server.listen(PORT, async () => {
    console.log(`Server berjalan pada port ${PORT}`);
    await connectDB();
});