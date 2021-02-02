import express from "express";
import cors from 'cors';
import * as cron from "node-cron"
import { pricesController } from "./Controllers/apiController";
import { updateData } from "./Controllers/cronController"

const app = express();
const port = 3003; // default port to listen

app.use(cors());
// define a route handler for the default home page
app.get("/prices", async(req: express.Request, res: express.Response): Promise<void> => {
    await pricesController(req, res);
});

// start the Express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});

// Run data srapping everyday.
cron.schedule('0 1 * * *', () => {
    updateData();
});
