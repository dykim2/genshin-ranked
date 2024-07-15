import { Express } from "express";
import { users } from "../rest/routes";

export async function setupRoutes(app: Express) {
  app.use("/users", users);

  console.log("Routes applied.");
}
