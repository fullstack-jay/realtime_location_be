import express from "express";
import AuthMiddleWare from "../middlewares/_auth_middleware";
import { deleteNotification, getNotifications } from "../controllers/notification";

const notificationRoutes = express.Router();

notificationRoutes.get("/", AuthMiddleWare.isLoggedIn, getNotifications);
notificationRoutes.delete(
    "/:id",
    AuthMiddleWare.isLoggedIn,
    deleteNotification
);

export default notificationRoutes;
