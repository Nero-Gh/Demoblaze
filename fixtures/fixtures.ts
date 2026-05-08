import * as userData from "../utils/test-data.json";
import { test as base } from "@playwright/test";

interface fixtureType {
  userData: typeof userData;
}

export const test = base.extend<fixtureType>({
  userData: async ({}, use) => {
    await use(userData);
  },
});

export { expect } from "@playwright/test";
