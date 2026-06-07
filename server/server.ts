import "dotenv/config";
import express from "express";
import type { NextFunction, Request, Response } from "express";
import cors from "cors";
import router from "./routes/index.js";

import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"
import { createServer } from "http";


const app = express();
const server = createServer(app);

// Middleware
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

app.get('/', (req: Request, res: Response) => {
    res.send('Server is Live!');
});

// list of api endpont
app.use("/api/v1", router)
app.use("/api/inngest", serve({ client: inngest, functions }));


// Error handling
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    const message = getErrorMessage(error);
    console.error(message, error);
    res.status(error?.type === "error" ? 503 : 500).json({ message });
});


server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
