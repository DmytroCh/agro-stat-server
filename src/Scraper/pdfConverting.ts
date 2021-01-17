import https from 'https'
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

const convertCountryScalePrices = (date: Date, page: string[][]) => {
    return {
        "date": date.toISOString(),
        "prices": {
            "wheat-2": page[5][0],
            "wheat-3": page[7][0],
            "wheat-4": page[9][0],
            "rye": page[11][0],
            "corn": page[13][0],
            "barley": page[15][0],
            "sunflower": page[17][0],
            "soybean": page[19][0],
            "buckwheat": page[21][0]
        }
    }
}

export const drawParse = async (pdfUrl: string) => {
    const url = pdfUrl;
    const buffer = await bufferize(url);
    let lines = await readlines(buffer, 1);
    lines = await JSON.parse(JSON.stringify(lines));
    console.log(lines)
};

// Return avg prices in country
export const countryScaleParse = async (date: Date, pdfUrl: string) => {
    const url = pdfUrl;
    const buffer = await bufferize(url);
    const lines = await readlines(buffer, 1);
    console.log(lines);
    const linesJson = await JSON.parse(JSON.stringify(lines));
    return convertCountryScalePrices(date, linesJson[1]);
};
