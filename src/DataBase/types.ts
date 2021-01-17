export type CropsPrices = {
    "date": Date,
    "prices": {
        "wheat-2": number,
        "wheat-3": number,
        "wheat-4": number,
        "rye": number,
        "corn": number,
        "barley": number,
        "sunflower": number,
        "soybean": number,
        "buckwheat": number
    }
}

export type Price = {
    cropName: Crop,
    country: Country,
    date: Date,
    price: number,
    currency: Currency
}

export enum Crop {
    wheat2 = "wheat-2",
    wheat3 = "wheat-3",
    wheat4 = "wheat-4",
    sunflower = "sunflower",
    rye = "rye",
    corn = "corn",
    barley = "barley",
    soybean = "soybean",
    buckwheat = "buckwheat"
}

// In ISO3166 standard
export enum Country {
    UKR = "UKR"
}

// In ISO4217 standard
export enum Currency {
    UAH = "UAH"
}
