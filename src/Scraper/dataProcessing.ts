import $ from 'cheerio'
import { drawParse, countryScaleParse } from './pdfConverting'


export async function getFormatedData(htmlResponse: string): Promise<any> {
    const aTags = $('.fr-file', htmlResponse);
    const pdfUrls = [];
    for(let i = 0; i < aTags.length; i++){
        pdfUrls.push(aTags[i].attribs.href);
    }

    console.log(drawParse(pdfUrls[0]))
    return countryScaleParse(pdfUrls[0]);
}
