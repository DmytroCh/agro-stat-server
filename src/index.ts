import express from "express";
import * as controller from "./Controllers/apiController"


const app = express();
const port = 8080; // default port to listen

// define a route handler for the default home page
app.get("/", (req: express.Request, res: express.Response): void => controller.pricesController(req, res));

// start the Express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
