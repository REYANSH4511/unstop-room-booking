import { Router } from "express";
import roomsRouter from "./rooms/index.js";
import bookingsRouter from "./bookings/index.js";

const apiV1Router = Router();

apiV1Router.use("/rooms", roomsRouter);
apiV1Router.use("/bookings", bookingsRouter);

export default apiV1Router;
