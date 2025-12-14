import express from "express";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { registerRoutes } from "./routes";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  try {
    const app = express(); // 🔴 ASTA lipsea sau era greșit
    const server = http.createServer(app);

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // static files
    app.use(express.static(path.join(__dirname, "public")));

    await registerRoutes(server, app);

    const PORT = process.env.PORT || 5000;

    server.listen(PORT, () => {
      console.log(`[express] Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
