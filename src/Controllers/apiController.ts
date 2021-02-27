import express from "express";
import { Crop } from "../DataBase/types";
import { dbGetPricesForSpecificCrop } from "./dbController";


export const pricesController = async (req: express.Request, res: express.Response): Promise<void> => {
    if(req.query.crop){
        const crop = req.query.crop;
        if(Object.values(Crop).includes(crop as Crop)){
            try{
                const data = await dbGetPricesForSpecificCrop(crop as Crop);
                res.status(200).send(data);
            }catch(e){
                console.error(e);
                res.status(500).send("Something went wrong");
            }
        }else {
            res.status(404).send("Incorrect crop name");
        }
    }else{
        res.status(404).send("crop is obligated parameter");
    }
}