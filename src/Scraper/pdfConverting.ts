import https from 'https'
import { ApiCropName } from '../DataBase/types';
import { Crop } from '../DataBase/types';
import { CropsPrices } from '../DataBase/types';
const pdfreader = require('pdfreader') // this lib does not have @types, so js syntax were used
// Docs: https://www.npmjs.com/package/pdfreader

async function bufferize(url: string) {
    let hn = url.substring(url.search("//") + 2);
    hn = hn.substring(0, hn.search("/"));
    let pt = url.substring(url.search("//") + 2);
    pt = pt.substring(pt.search("/"));
    const options = { hostname: hn, port: 443, path: pt, method: "GET" };
    return new Promise((resolve, reject) => {
      let buff = Buffer.alloc(0);
      const req = https.request(options, (res) => {
        res.on("data", (d) => {
          buff = Buffer.concat([buff, d]);
        });
        res.on("end", () => {
          resolve(buff);
        });
      });
      req.on("error", (e) => {
        console.error("https request error: " + e);
      });
      req.end();
    });
  }

  async function readlines(buffer: any, xwidth: number) {
    return new Promise((resolve, reject) => {
      const pdftxt = new Array();
      let pg = 0;
      new pdfreader.PdfReader().parseBuffer(buffer, (err: string, item: { page: number; text: string; y: any; x: number; }) => {
        if (err) console.log("pdf reader error: " + err);
        else if (!item) {
          pdftxt.forEach((a, idx) => {
            pdftxt[idx].forEach((v: any, i: string | number) => {
              pdftxt[idx][i].splice(1, 2);
            });
          });
          resolve(pdftxt);
        } else if (item && item.page) {
          pg = item.page - 1;
          pdftxt[pg] = [];
        } else if (item.text) {
          let t = 0;
          let sp = "";
          pdftxt[pg].forEach((val: number[], idx: string | number) => {
            if (val[1] === item.y) {
              if (xwidth && item.x - val[2] > xwidth) {
                sp += " ";
              } else {
                sp = "";
              }
              pdftxt[pg][idx][0] += sp + item.text;
              t = 1;
            }
          });
          if (t === 0) {
            pdftxt[pg].push([item.text, item.y, item.x]);
          }
        }
      });
    });
  }



const convertCountryScalePrices = (date: Date, page: string[][]): CropsPrices => {
    console.log(date);
    return {
        "date": date,
        "prices": {
            "wheat_2": findCropPrice(ApiCropName.wheat2, page),
            "wheat_3": findCropPrice(ApiCropName.wheat3, page),
            "wheat_4": findCropPrice(ApiCropName.wheat4, page),
            "rye": findCropPrice(ApiCropName.rye, page),
            "corn": findCropPrice(ApiCropName.corn, page),
            "barley": findCropPrice(ApiCropName.barley, page),
            "sunflower": findCropPrice(ApiCropName.sunflower, page),
            "soybean": findCropPrice(ApiCropName.soybean, page),
            "buckwheat": findCropPrice(ApiCropName.buckwheat, page)
        }
    }
}

const findCropPrice = (cropName: ApiCropName, page: string[][]): number => {
    let mainIndex = -1;
    let index = -1;
    for(let i = 0; mainIndex < 0 && i < page.length; i ++){
        index = page[i].findIndex((el) => el[0].includes(cropName));
        if (index > 0)
            mainIndex = i;
    }
    if(index < 0){
        console.log(page);
        throw Error(`Crop not found: ${cropName}`);
    }else {
        const price = parseInt(page[1][index + 1][0].replace(/\s+/g, ''), 10); // remove spaces and parse to int
        return price;
    }
}

/*export const drawParse = async (pdfUrl: string) => {
    const url = pdfUrl;
    const buffer = await bufferize(url);
    let lines = await readlines(buffer, 1);
    lines = await JSON.parse(JSON.stringify(lines));
};*/

// Return avg prices in country
export const countryScaleParse = async (date: Date, pdfUrl: string): Promise<CropsPrices> => {
    const url = pdfUrl;
    const buffer = await bufferize(url);
    const lines = await readlines(buffer, 1);
    // console.log(typeof(lines));
    const linesJson = await JSON.parse(JSON.stringify(lines));
    // console.log(linesJson[1]);
    return convertCountryScalePrices(date, linesJson);
};
