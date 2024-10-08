import { getProxies } from './proxy/proxy_manage.js';

getProxies()
  .then((proxyUrl) => console.log(`Obtained random proxy: ${proxyUrl}`))
  .catch((error) => console.error('Failed to get proxy:', error));
