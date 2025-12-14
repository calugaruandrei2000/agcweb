import express from "express";
import http from "http";
import path from "path";
import { registerRoutes } from "./routes";

async function startServer() {
  try {
    const app = express();
    const server = http.createServer(app);

    // Middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // ✅ CJS-safe path pentru static files
    const publicPath = path.join(process.cwd(), "dist", "public");
    app.use(express.static(publicPath));

    console.log("[server] Registering routes...");
    await registerRoutes(app, server);
    console.log("[server] Routes registered.");

    // Port
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`[express] Server running on port ${PORT}`);
    });

    // Optional: health check endpoint
    app.get("/health", (_req, res) => {
      res.json({ status: "ok", timestamp: new Date().toISOString() });
    });

    console.log("[server] Server setup complete, waiting for requests...");
  } catch (err) {
    console.error("[server] Failed to start server:", err);
    process.exit(1);
  }
}

// Start server
startServer();
