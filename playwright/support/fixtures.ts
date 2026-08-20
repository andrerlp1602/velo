import { test as base } from "@playwright/test";

import { createAppHeaderActions } from "./actions/appHeaderActions";
import { createLandingActions } from "./actions/landingActions";
import { createOrderLockupActions } from "./actions/orderLockupActions";

type App = {
  landing: ReturnType<typeof createLandingActions>;
  appHeader: ReturnType<typeof createAppHeaderActions>;
  orderLockup: ReturnType<typeof createOrderLockupActions>;
};

export const test = base.extend<{ app: App }>({
  app: async ({ page }, use) => {
    const app: App = {
      landing: createLandingActions(page),
      appHeader: createAppHeaderActions(page),
      orderLockup: createOrderLockupActions(page),
    };
    await use(app);
  },
});

export { expect } from "@playwright/test";
