import { Crop, CropsPrices, Price } from "../DataBase/types"
import { getLastPricesUpdateDate, getPricesForSpecificCrop, saveCropPrice } from "../DataBase/dbOperations"
/*export const getPrices = (): CropsPrices => {
    return {
        "date": new Date("2021-01-05T23:00:00.000Z"),
        "prices": {
          "wheat-2": 7695,
          "wheat-3": 7638,
          "wheat-4": 7453,
          "rye": 5458,
          "corn": 6873,
          "barley": 6950,
          "sunflower": 18640,
          "soybean": 16540,
          "buckwheat": 18363
        }
      }
}*/

export const dbSavePriceForCrop = async (price: Price) => {
    return saveCropPrice(price);
}

export const dbGetPricesUpdateDate = async (): Promise<Date> => {
    const date = await getLastPricesUpdateDate();
    return date;
}

export const dbGetPricesForSpecificCrop = async (cropName: Crop): Promise<Price[]> => {
    return getPricesForSpecificCrop(cropName);
}
