import { CropsPrices, Price } from "./types"
import { getLastPricesUpdateDate, saveCropPrice } from "./dbOperations"
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
    const date = await saveCropPrice(price);
    return date;
}

export const dbGetPricesUpdateDate = async (): Promise<Date> => {
    const date = await getLastPricesUpdateDate();
    return date;
}