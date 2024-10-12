import axios from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';

const proxy = process.env.PROXY_URL;
const agent = new HttpsProxyAgent(proxy);

axios
  .get(
    'https://www.dextools.io/shared/data/pair?address=0xc555d55279023e732ccd32d812114caf5838fd46&chain=ether&audit=true&locks=true',
    { httpsAgent: agent },
  )
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error(error);
  });
