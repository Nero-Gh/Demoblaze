// e2e/tests/regression-category-monitors.spec.ts
import { expect, test } from "../../fixtures/fixtures";
import { HomePage } from "../../page/HomePage";

test.describe("@regression Regression Test Suite - Product Category", () => {
  test("TC-REG-006: Verify Product Search by Category - Monitors", async ({
    page,
    userData,
  }) => {
    const homePage = new HomePage(page);

    const expectedMonitors = userData.categories.monitors.expectedProducts;

    const forbiddenProducts = userData.categories.phones.expectedProducts;

    await test.step("Navigate to homepage", async () => {
      await homePage.goto();
      await expect(page.locator("#nava")).toContainText("PRODUCT STORE");
    });

    await test.step("Select Monitors category", async () => {
      await homePage.selectCategory("Monitors");
    });

    await test.step("Verify product count is greater than 0", async () => {
      const monitorCount = await homePage.getProductCount();
      expect(
        monitorCount,
        `Expected monitors > 0, found ${monitorCount}`,
      ).toBeGreaterThan(0);
    });

    await test.step("Verify only monitor products are displayed", async () => {
      const titles = await homePage.getProductTitles();
      console.log(titles);

      const hasMonitor = expectedMonitors.some((monitor) =>
        titles.some((t) => t.includes(monitor)),
      );
      console.log(hasMonitor);
      expect(hasMonitor, "Expected at least one known monitor product").toBe(
        true,
      );

      await homePage.verifyNoCategoryContamination(forbiddenProducts);
    });
  });
});
