import { statApi } from "../Scraper/apiAdapter";
import { proceedScraping } from "../Scraper/dataProcessing";
import * as db from "../DataBase/dbOperations"

export const updateData = (): void => {
    proceedScraping();
}