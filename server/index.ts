import express from "express";
import http from "http";
import path from "path";
import { registerRoutes } from "./routes";

async function startServer() {
  try {
    const app = express();
    const server = http.createServer(app);

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // ✅ CJS-safe path
    const publicPath = path.join(process.cwd(), "dist", "public");
    app.use(express.static(publicPath));

    await registerRoutes(app, server);

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
