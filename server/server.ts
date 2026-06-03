import "dotenv/config";
import express from "express";
import type { NextFunction, Request, Response } from "express";
import cors from "cors";
import router from "./routes/index.js";

import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"


const app = express();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.options("/{*path}", cors({ origin: true, credentials: true }));
app.use(express.json());


const port = process.env.PORT || 5000;

app.get('/', (req: Request, res: Response) => {
    res.send('Server is Live!');
});

// list of api endpont
app.use("/api/v1", router)
app.use("/api/inngest", serve({ client: inngest, functions }));


// Error handling
app.use((error: any, req:Request, res:Response, next: NextFunction) => {
    console.error(error)
    res.status(500).json({message: error.message})
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});