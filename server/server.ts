import "dotenv/config";
import express from "express";
import type { NextFunction, Request, Response } from "express";
import cors from "cors";
import router from "./routes/index.js";

import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"
import { createServer } from "http";
import { stripeWebhook } from "./controller/webhooks.js";
import { prisma } from "./config/db.js";

const app = express();
const server = createServer(app);

// ✅ FIX 1: Stripe webhook must be registered FIRST, before any body parsers,
// because Stripe needs the raw request body for signature verification.
app.post("/api/stripe", express.raw({ type: "application/json" }), stripeWebhook);

// ✅ FIX 2: Inngest must be mounted BEFORE express.json().
// express.json() consumes the request body stream, which breaks Inngest's
// SSE (Server-Sent Events) handshake and causes the
// "non-101 status code / ErrorEvent { type: 'error' }" you were seeing.
app.use("/api/inngest", serve({ client: inngest, functions }));

// Global middleware (registered AFTER Inngest and Stripe)
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const port = process.env.PORT || 5000;

const getErrorMessage = (error: any) => {
    if (error?.message) return error.message;
    if (error?.reason?.message) return error.reason.message;
    if (error?.error?.message) return error.error.message;
    if (error?.type === "error") {
        return "Database connection failed. Check DATABASE_URL, internet access, and Neon database status.";
    }
    return "Internal server error";
}

app.get("/", (req: Request, res: Response) => {
    res.send("Server is Live!");
});

app.use("/api/v1", router);

// Error handling
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    const message = getErrorMessage(error);
    console.error(message, error);
    res.status(error?.type === "error" ? 503 : 500).json({ message });
});

server.listen(port, async () => {
  console.log(`Server running at http://localhost:${port}`);
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("✅ Database connected successfully");
  } catch (err: any) {
    console.error("❌ DB error:", err.message);
  }
});