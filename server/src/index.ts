import express from "express";
import { createServer } from "http";
import { setupMiddleware, setupMongo, setupRoutes } from "./setup";
import * as dotenv from "dotenv";
import { geckos } from "@geckos.io/server";

const startup = async () => {
	dotenv.config();

	const app = express();
	const server = createServer(app);
	const udp = geckos();

	await setupMiddleware(app);
	await setupMongo();
	await setupRoutes(app);
	// await setupUDP(server, udp);

	server.listen(3001, () =>
		console.log("HTTP server has started on http://localhost:3001/"),
	);
};

startup();
