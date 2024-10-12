// dataFetchers.ts

import { Page } from 'playwright';

export async function fetchTokenData(page: Page): Promise<any> {
  const jsonData = await page.evaluate(() =>
    JSON.parse(document.body.innerText),
  );

  if (jsonData.code === 0) {
    return jsonData.data;
  } else {
    throw new Error(jsonData.message || jsonData.msg || 'Unknown error');
  }
}
