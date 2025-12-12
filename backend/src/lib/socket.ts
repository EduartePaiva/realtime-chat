import { Server } from "socket.io";

// userID: socketID
const userSocketMap: { [key: string]: string } = {};

const io = new Server({
  cors: {
    origin: ["http://localhost:5173"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userID = socket.handshake.query.userID;
  if (!userID || typeof userID !== "string") {
    return;
  }
  userSocketMap[userID] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userID];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export default io;
