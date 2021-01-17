import { statApi } from "../Scraper/apiAdapter";
import { getFormatedData } from "../Scraper/dataProcessing";

export const updateData = async (): Promise<void> => {
    console.log("Start data update");
    const URL = "https://agro.me.gov.ua/ua/investoram/monitoring-stanu-apk/riven-serednozvazhenih-cin-na-osnovni-vidi-silskogospodarskoyi-produkciyi"
    const api = statApi()
    await api.get(URL).then(async resp => {
        const data = await getFormatedData(resp.data);
        // console.log(data);
        // res.send(data); // here must be database update
    }).catch(console.error);
    console.log("Data update was finished");
}