import { number } from "currency-codes";
import express from "express";
// import * as controller from "./Controllers/apiController"
import * as cron from "node-cron"
import { updateData } from "./Controllers/cronController"
import { dbGetPricesForSpecificCrop } from "./Controllers/dbController";
import * as db from "./DataBase/dbOperations"
import { Country, Crop, Currency } from "./DataBase/types"


const app = express();
const port = 8080; // default port to listen

// define a route handler for the default home page
app.get("/", async(req: express.Request, res: express.Response): Promise<void> => {
    res.send(await dbGetPricesForSpecificCrop(Crop.wheat2));
    // controller.pricesController(req, res)
    // db.saveCrop(Crop.wheat2, Country.UKR, new Date(), 234, Currency.UAH);
    /*const response = await db.saveCropPrice({
        cropName: Crop.wheat3,
        country: Country.UKR,
        date: new Date(),
        price: 12345,
        currency: Currency.UAH
    });
    console.log(response);*/
});

// start the Express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});

// Run data srapping everyday.
cron.schedule('0 1 * * *', () => {
    updateData();
});
