import pool from "./dbConnector";
import { Crop, Price, Range } from "./types";


export const saveCropPrice = async (priceObject: Price) => {
    /**
     * Save price of specific crop to DB agro-stat-db.prices
     */
    const cropId = await getCropId(priceObject.cropName);
    const client = await pool.connect();
    try{
        const dateString = priceObject.date.toISOString().slice(0, 10);
        console.log("String date", dateString);
        const result = await client.query(
            'INSERT INTO prices (crop_name_id, data_date, country, currency, price) VALUES ($1,$2,$3,$4,$5);',
            [cropId, dateString, priceObject.country, priceObject.currency, priceObject.price]
        )
        console.log("Reccord was added");
        return result;
    }catch(e){
        console.error('query error', e.message, e.stack);
    }finally {
        client.release()
    }
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

export const getPricesForSpecificCrop = async (cropName:Crop): Promise<Price[]> => {
    const client = await pool.connect();
    const cropId = await getCropId(cropName);
    try{
        const result = await client.query("SELECT * FROM prices LEFT JOIN crops ON prices.crop_name_id = crops.crop_id WHERE crop_name_id = $1",
                                        [cropId]);
        return parseResponseToPriceObjects(result.rows);
    }catch(e){
        console.error('query error', e.message, e.stack);
    }finally {
        client.release()
    }
}

export const getPricesForSpecificCropAndRange = async (cropName:Crop, range: Range): Promise<Price[]> => {
    const client = await pool.connect();
    const cropId = await getCropId(cropName);
    const start = range.start;
    const end = range.end;
    try{
        const result = await client.query(
            "SELECT * FROM prices LEFT JOIN crops ON prices.crop_name_id = crops.crop_id WHERE crop_name_id = $1 AND prices.data_date BETWEEN $2 AND $3",
            [cropId, start, end]
        );
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
        if (result.rows.length > 0){
            const date = new Date(result.rows[0].data_date);
            date.setHours(date.getHours() + 2); // fix timezone issue
            console.log('Newest date were recived', date);
            return date;
        }else
            return new Date("1970-01-30T22:00:00.000Z"); // no reccords in DB
    }catch(e){
        console.error('query error', e.message, e.stack);
    }finally {
        client.release()
    }
}

const parseResponseToPriceObjects = (response: any[]): Price[] => {
    const res = Array<Price>();
    response.forEach(el => {
        res.push({
            cropName: el.crop_name,
            country: el.country,
            date: el.data_date,
            price: +el.price,
            currency: el.currency
        });
    });
    res.sort((a, b) => {
        return a.date.getTime() - b.date.getTime();
    });
    return res;
}
