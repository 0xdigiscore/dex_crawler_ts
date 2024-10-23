import { createPlaywrightRouter } from 'crawlee';
import { rankSolTokens } from './handlers/rankSolTokens.js';
import { rankEthTokens } from './handlers/rankEthTokens.js';
import { rankEthWallets } from './handlers/rankEthWallets.js';
import { rankSolWallets } from './handlers/rankSolWallets.js';
import { topTokenTraders } from './handlers/tokenTopTraders.js';
import { smartEthWalletNew } from './handlers/smartEthWalletNew.js';
import { smartWalletActivity } from './handlers/smartWalletActivity.js';
import { topBuyers } from './handlers/topBuyers.js';

export const router = createPlaywrightRouter();

router.addDefaultHandler(async ({ page, request }) => {
  const title = await page.title();
  console.log(`URL: ${request.url}`);
  console.log(`Title: ${title}`);
});
router.addHandler('rank/eth/swaps', rankEthTokens);
//router.addHandler('rank/sol/swaps', rankSolTokens);
router.addHandler('rank/eth/wallets', rankEthWallets);
router.addHandler('rank/sol/wallets', rankSolWallets);
//router.addHandler('top/token/traders', topTokenTraders);
router.addHandler('smart/new/wallet', smartEthWalletNew);
router.addHandler('smart/wallet/activity', smartWalletActivity);
router.addHandler('top/buyers', topBuyers);
