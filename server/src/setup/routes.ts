import { users } from "../rest/routes";
import { Express } from "express";

export async function setupRoutes(app: Express) {
	app.use("/users", users);

	console.log("Routes applied.");
}
