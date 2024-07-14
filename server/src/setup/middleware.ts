import express, { Express } from "express";
import cors from "cors";
import session from "express-session";
import "express-session";

// Allow session to take a beaerer_token
declare module "express-session" {
	interface SessionData {
		bearer_token: string;
	}
}

export async function setupMiddleware(app: Express) {
	// JSON:
	app.use(express.json({ limit: "50mb" }));

	// Sessions:
	app.use(
		session({
			secret: process.env.SESSION_KEY || "secret",
			resave: true,
			saveUninitialized: false,
			cookie: { secure: false, maxAge: 99999999 }, // TODO: Make Secure = True When SSL Added
		}),
	);

	// Middleware:
	app.use(
		cors({
			credentials: true,
			origin: process.env.CLIENT_REDIRECT_URL || "http://localhost:5173/",
		}),
	);

	console.log("Middleware applied.");
}
