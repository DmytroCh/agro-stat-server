import pool from "./dbConnector";
import * as ISO3166 from "iso-3166-1"; // countries
import * as ISO4217 from "currency-codes";
// import { Country } from "iso-3166-1/dist/iso-3166";
import { CurrencyCodeRecord } from "currency-codes";
import { Crop, Price } from "./types";


export const saveCropPrice = async (priceObject: Price) => {
    /**
     * Save price of specific crop to DB agro-stat-db.prices
     */
    const cropId = await getCropId(priceObject.cropName);
    pool.connect((err, client, done) => {
        if (err) throw new Error();
        const dateString = priceObject.date.toISOString().slice(0, 10);
        client.query('INSERT INTO prices (crop_name_id, data_date, country, currency, price) VALUES ($1,$2,$3,$4,$5);',
                    [cropId, dateString, priceObject.country, priceObject.currency, priceObject.price])
        .then(() => {
            client.release();
            console.log("Reccord was added");
        })
        .catch(e => {
            client.release();
            console.error('query error', e.message, e.stack)
        })
    });
}

const getCropId = async (cropName:Crop): Promise<number> => {
    const client = await pool.connect();
    try{
        const result = await client.query("SELECT crop_id FROM crops WHERE crop_name=$1", [cropName]);
        console.log('Crop name was recived', result.rows[0].crop_id);
        return result.rows[0].crop_id;
    }catch(e){
        console.error('query error', e.message, e.stack);
    }finally {
        client.release()
    }
}

export const getPricesForSpecificCrop = async (cropName:Crop): Promise<any[]> => {
    const client = await pool.connect();
    const cropId = await getCropId(cropName);
    try{
        const result = await client.query("SELECT * FROM prices LEFT JOIN crops ON prices.crop_name_id = crops.crop_id WHERE crop_name_id = $1",
                                        [cropId]);
        console.log('Prices were recived', result.rows);
        return parseResponseToPriceObjects(result.rows);
    }catch(e){
        console.error('query error', e.message, e.stack);
    }finally {
        client.release()
    }
}

export const getLastPricesUpdateDate = async (): Promise<Date> => {
    const client = await pool.connect();
    try{
        const result = await client.query("SELECT data_date FROM prices ORDER BY data_date DESC LIMIT 1");
        console.log('Newest date were recived', result.rows);
        if (result.rows.length > 0)
            return new Date(result.rows[0].data_date);
        else
            return new Date("1970-01-30T22:00:00.000Z"); // no reccords in DB
    }catch(e){
        console.error('query error', e.message, e.stack);
    }finally {
        client.release()
    }
}

const parseResponseToPriceObjects = (response: any[]) => {
    const res = Array<Price>();
    response.forEach(el => {
        res.push({
            cropName: el.crop_name,
            country: el.country,
            date: new Date(el.data_date),
            price: el.price,
            currency: el.currency
        });
    });
    return res;
}
