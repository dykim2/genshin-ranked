import express from "express";
import { createServer } from "http";
import { setupMiddleware, setupMongo, setupRoutes } from "./setup";
import * as dotenv from "dotenv";

const startup = async () => {
  dotenv.config();

  const app = express();
  const server = createServer(app);

  await setupMiddleware(app);
  await setupMongo();
  await setupRoutes(app);

  server.listen(3001, () =>
    console.log("HTTP server has started on http://localhost:3001/")
  );
};

startup();
