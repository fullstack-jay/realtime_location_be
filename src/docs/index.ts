import dotenv from "dotenv";
import { account, accountDefinitions } from "./restful/account";

dotenv.config();

const paths = { ...account };

const definitions = {
  ...accountDefinitions,
};

const host =
  process.env.NODE_ENV === "production"
    ? process.env.BASE_URL?.split("https://")[1]
    : process.env.BASE_URL?.split("http://")[1];

const config = {
  swagger: "2.0",
  info: {
    title: "Quick step API Documentation",
    version: "1.0.0",
    description:
      "Real-time live location tracking app in Flutter - Backend API",
  },
  host,
  basePath: "/api/v1",
  schemes: process.env.NODE_ENV === "production" ? ["https"] : ["http"],
  securityDefinitions: {
    JWT: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
    },
  },
  paths,
  definitions,
};

export default config;
