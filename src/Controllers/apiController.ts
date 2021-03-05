import express from "express";
import { Crop, Range } from "../DataBase/types";
import { dbGetPricesForSpecificCrop, dbGetPricesForSpecificCropAndRange } from "./dbController";


export const pricesController = async (req: express.Request, res: express.Response): Promise<void> => {
    if(req.query.crop){
        const crop = req.query.crop;
        const range = {
            start: req.query.start ? req.query.start : undefined,
            end: req.query.end ? req.query.end : undefined
        }

        if(Object.values(Crop).includes(crop as Crop)){
            try{
                let data;
                if(range.start && range.end){
                    data = await dbGetPricesForSpecificCropAndRange(crop as Crop, range as Range)
                }else{
                    data = await dbGetPricesForSpecificCrop(crop as Crop);
                }
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