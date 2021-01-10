import express from "express";
import { getFormatedData } from "./Scraper/dataProcessing";
import { statApi } from "./Scraper/apiAdapter";
const app = express();
const port = 8080; // default port to listen

// define a route handler for the default home page
app.get( "/", async ( req, res ) => {
    const url = "https://agro.me.gov.ua/ua/investoram/monitoring-stanu-apk/riven-serednozvazhenih-cin-na-osnovni-vidi-silskogospodarskoyi-produkciyi"
    const api = statApi()
    api.get(url).then(async resp => {
        const data = await getFormatedData(resp.data);
        res.send(data);
    }).catch(console.error);
} );

// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );
