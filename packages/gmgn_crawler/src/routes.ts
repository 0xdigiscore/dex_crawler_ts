import { createPlaywrightRouter } from 'crawlee';
import { rankSolTokens } from './handlers/rankSolTokens.js';
import { rankEthTokens } from './handlers/rankEthTokens.js';
import { rankEthWallets } from './handlers/rankEthWallets.js';
import { rankSolWallets } from './handlers/rankSolWallets.js';
import { topTokenTraders } from './handlers/tokenTopTraders.js';
import { oneStepEthWallets } from './handlers/1stepEthWallets.js';
import { smartEthWalletNew } from './handlers/smartEthWalletNew.js';
import { smartWalletActivity } from './handlers/smartWalletActivity.js';

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
router.addHandler('1step/eth/wallets', oneStepEthWallets);
router.addHandler('smart/new/wallet', smartEthWalletNew);
router.addHandler('smart/wallet/activity', smartWalletActivity);
