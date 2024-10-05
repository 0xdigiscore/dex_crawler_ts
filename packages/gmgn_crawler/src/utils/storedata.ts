import { Dataset } from "crawlee";
//import { getDatasetName } from "@/const/crawlerUrls.js";

const storeData = async (
  url: string,
  data: any,
  datasetName: string,
  log: any
) => {
  log.info(`Storing data in dataset: ${datasetName}`);
  log.debug(`Data to be stored: ${JSON.stringify(data)}`);

  const dataset = await Dataset.open(datasetName);
  await dataset.pushData({
    url: url,
    data: data,
    timestamp: new Date().toISOString(),
  });

  log.info(`Data stored in dataset: ${datasetName}`);
};

export { storeData };
