import express from "express";
import { statApi } from "../Scraper/apiAdapter";


/*export const pricesController = (req: express.Request, res: express.Response): void => {
    const URL = "https://agro.me.gov.ua/ua/investoram/monitoring-stanu-apk/riven-serednozvazhenih-cin-na-osnovni-vidi-silskogospodarskoyi-produkciyi"
    const api = statApi()
    api.get(URL).then(async resp => {
        const data = await getFormatedData(resp.data);
        res.send(data);
    }).catch(console.error);
}*/