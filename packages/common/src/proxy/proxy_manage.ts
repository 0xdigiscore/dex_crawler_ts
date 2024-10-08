import https from 'https';
import zlib from 'zlib';
import dotenv from 'dotenv';

dotenv.config();

const USERNAME = process.env.PROXY_USERNAME;
const PASSWORD = process.env.PROXY_PASSWORD;
const PROXY_URL_ADDRESS = process.env.PROXY_URL_ADDRESS;
if (!USERNAME || !PASSWORD) {
  throw new Error('Missing required environment variables');
}

const getAddress = PROXY_URL_ADDRESS;

const base64 = Buffer.from(`${USERNAME}:${PASSWORD}`).toString('base64');

export const getProxies = (): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    https
      .get(
        getAddress,
        {
          headers: {
            Authorization: `Basic ${base64}`,
          },
        },
        (res) => {
          let stream: NodeJS.ReadableStream = res;

          if (res.headers['content-encoding']?.toLowerCase() === 'gzip') {
            stream = stream.pipe(zlib.createGunzip());
          }

          let data = '';
          stream.on('data', (chunk) => {
            data += chunk;
          });

          stream.on('end', () => {
            const proxies = data
              .trim()
              .split('\n')
              .map((line) => {
                const [proxy_ip, proxy_port] = line.trim().split(':');
                return `http://${USERNAME}:${PASSWORD}@${proxy_ip}:${proxy_port}`;
              });
            console.log('Obtained proxies:', proxies);
            resolve(proxies);
          });
        },
      )
      .on('error', (err) => {
        console.error('Error sending request to getAddress:', err);
        reject(err);
      });
  });
};
