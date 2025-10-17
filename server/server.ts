import { createServer } from "http";
import { Server } from "socket.io";
import app from "./src/app";
import redis from "./src/config/redis";
import { createAdapter } from "@socket.io/redis-adapter";

const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

(async () => {
  await redis.connect();
  console.log("Main Redis connected ✅");

  const pubClient = redis.duplicate();
  const subClient = redis.duplicate();

  await Promise.all([pubClient.connect(), subClient.connect()]);

  io.adapter(createAdapter(pubClient, subClient));
  console.log("Redis adapter connected ✅");

  io.on("connection", (socket: any) => {
    console.log("A user connected:", socket.id);

    socket.on("joinRoom", (userId: string) => {
      socket.join(userId);
      console.log(`User ${userId} joined room`);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });

  httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();

export { io };
