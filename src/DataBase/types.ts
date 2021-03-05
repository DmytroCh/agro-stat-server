export type CropsPrices = {
    "date": Date,
    "prices": {
        "wheat_2": number,
        "wheat_3": number,
        "wheat_4": number,
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

// This is crop name in our DB
export enum Crop {
    wheat2 = "wheat_2",
    wheat3 = "wheat_3",
    wheat4 = "wheat_4",
    sunflower = "sunflower",
    rye = "rye",
    corn = "corn",
    barley = "barley",
    soybean = "soybean",
    buckwheat = "buckwheat"
}

// This is name of crops in statistic data
export enum ApiCropName {
    wheat2 = "Пшениця 2 кл.",
    wheat3 = "Пшениця 3 кл.",
    wheat4 = "Пшениця 4 кл.",
    sunflower = "Соняшник",
    rye = "Жито",
    corn = "Кукурудза",
    barley = "Ячмінь 3 кл.",
    soybean = "Соя",
    buckwheat = "Гречка"
}

// In ISO3166 standard
export enum Country {
    UKR = "UKR"
}

// In ISO4217 standard
export enum Currency {
    UAH = "UAH"
}

export type Range = {
    start: string,
    end: string
}
