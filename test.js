import axios from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';

const proxy = process.env.PROXY_URL;
const agent = new HttpsProxyAgent(proxy);

axios
  .get(
    'https://api.geckoterminal.com/api/v2/networks/eth/tokens/0x0f7fc7761d5b32496fbdfe2945c563cd3b1274d5',
    { httpsAgent: agent },
  )
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error(error);
  });
