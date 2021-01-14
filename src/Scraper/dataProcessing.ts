import $ from 'cheerio'
import { drawParse, countryScaleParse } from './pdfConverting'


export async function getFormatedData(htmlResponse: string): Promise<any> {
    const aTags = $('.fr-file', htmlResponse);
    const pdfUrls = [];
    for(let i = 0; i < aTags.length; i++){
        pdfUrls.push(aTags[i].attribs.href);
    }
    // console.log(pdfUrls);

    // drawParse(pdfUrls[0]);
    return countryScaleParse(getData(pdfUrls[0]), pdfUrls[0]);
}

function getData(url: string): Date {
    const stringDate = url.slice(-14, -4);
    const date = new Date(stringDate.replace(/(\d{2})_(\d{2})_(\d{4})/, "$2/$1/$3"))
    return date;
}
