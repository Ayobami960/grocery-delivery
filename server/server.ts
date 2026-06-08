import "dotenv/config";
import express from "express";
import type { NextFunction, Request, Response } from "express";
import cors from "cors";
import router from "./routes/index.js";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
import { createServer } from "http";
import { stripeWebhook } from "./controller/webhooks.js";

const app = express();
const server = createServer(app);

app.post("/api/stripe", express.raw({ type: "application/json" }), stripeWebhook);
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const port = process.env.PORT || 5000;

app.get("/", (req: Request, res: Response) => {
  res.send("Server is Live!");
});

app.use("/api/v1", router);

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  res.status(500).json({ message: error?.message || "Internal server error" });
});



server.listen(port, async () => {
  const { prisma } = await import("./config/db.js") // ← after dotenv is ready
  
  console.log(`Server running at http://localhost:${port}`);
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("✅ Database connected successfully");
  } catch (err: any) {
    console.error("❌ DB error:", err.message);
  }
});