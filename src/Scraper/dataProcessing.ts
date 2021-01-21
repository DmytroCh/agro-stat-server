import $ from 'cheerio'
import { countryScaleParse } from './pdfConverting'
import { statApi } from "./apiAdapter";
import { dbGetPricesUpdateDate, dbSavePriceForCrop } from '../DataBase/dbController';
import { Country, Crop, CropsPrices, Currency, Price } from '../DataBase/types';


async function getFormatedData(htmlResponse: string): Promise<Price[]> {
    const aTags = $('.fr-file', htmlResponse);
    const lastPricesUpdateDate = await dbGetPricesUpdateDate();
    const criticalDate = new Date("2019-07-13T22:00:00.000Z"); // before this date were incorrect data
    const meanResult = [];
    const result = new Array<Price>();
    for(let i = 0; i < 3; i++){
        const url = aTags[i].attribs.href;
        const dataDate = getDate(url);
        if (dataDate.getTime() > lastPricesUpdateDate.getTime() &&
            dataDate.getTime() > criticalDate.getTime()){
            const prices = await countryScaleParse(dataDate, url);
            const price = cropPricesToListOfPrices(prices);
            meanResult.push(price);
        }
    }
    meanResult.forEach(mr => {
        mr.forEach(p =>{
            result.push(p);
        });
    });
    return result;
}

function getDate(url: string): Date {
    const regexps = [
        /[0-3][0-9]_[0-1][0-9]_[0-9][0-9][0-9][0-9]\.pdf/gm, // 6_15_01_2021.pdf
        /....[0-3][0-9][0-1][0-9][0-9][0-9][0-9][0-9]\.pdf/gm, // dni-14082020.pdf
        /..[0-3][0-9][0-1][0-9][0-9][0-9][0-9][0-9]-.\.pdf/gm, // i-21022020-2.pdf
        /..[0-3][0-9]\.[0-1][0-9]\.[0-9][0-9][0-9][0-9]\.pdf/gm// 2005.07.2019.pdf
    ];
    const stringDate = url.slice(-16);
    const index = regexps.findIndex(regexp => stringDate.match(regexp));
    switch (index){
        case 0:
            return new Date(stringDate.slice(2, -4).replace(/(\d{2})_(\d{2})_(\d{4})/, "$2/$1/$3"));
        case 1:
            return new Date(stringDate.slice(4, -4).replace(/(\d{2})(\d{2})(\d{4})/, "$2/$1/$3"));
        case 2:
            return new Date(stringDate.slice(2, -6).replace(/(\d{2})(\d{2})(\d{4})/, "$2/$1/$3"));
        case 3:
            return new Date(stringDate.slice(2, -4).replace(/(\d{2})\.(\d{2})\.(\d{4})/, "$2/$1/$3"));
        default:
            throw Error(`${stringDate} does not match any patterns`);
    }
}

function cropPricesToListOfPrices(cropsPrices: CropsPrices): Price[] {
    const prices = Object.entries(cropsPrices.prices);
    const result = new Array<Price>();
    prices.forEach((price) => {
        result.push({
                cropName: price[0] as Crop,
                country: Country.UKR,
                date: cropsPrices.date,
                price: price[1],
                currency: Currency.UAH
            });
    });

    return result;
}

export async function proceedScraping(): Promise<void> {
    console.log("Start data update");
    const url = "https://agro.me.gov.ua/ua/investoram/monitoring-stanu-apk/riven-serednozvazhenih-cin-na-osnovni-vidi-silskogospodarskoyi-produkciyi";
    const api = statApi();
    await api.get(url).then(async resp => {
        const data = await getFormatedData(resp.data);
        console.log(data);
        data.forEach(price => dbSavePriceForCrop(price));
        // res.send(data); // here must be database update
    }).catch(console.error);
    console.log("Data update was finished");
}
