import express from "express";
import accountRoutes from "./_account_route";
import movementRoutes from "./_movement_route";
import notificationRoutes from "./_notification_route";
import profileRoutes from "./_profile_route";
import config from "../../docs";
import swaggerUi from "swagger-ui-express";


const routes = express.Router();

routes.use("/accounts", accountRoutes);
routes.use("/movements", movementRoutes);
routes.use("/notifications", notificationRoutes);
routes.use("/profile", profileRoutes);
routes.use("/docs", swaggerUi.serve, swaggerUi.setup(config));

export default routes;