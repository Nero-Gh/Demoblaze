import { expect, test } from "../../fixtures/fixtures";
import { HomePage } from "../../page/HomePage";

test.describe("@regression Regression Test Suite - Product Category", () => {
  test("TC-REG-005: Verify Product Search by Category - Laptops", async ({
    page,
    userData,
  }) => {
    const homePage = new HomePage(page);

    const expectedLaptops = userData.categories.laptops.expectedProducts;

    const forbiddenProducts = userData.categories.monitors.expectedProducts;

    await test.step("Navigate to homepage", async () => {
      await homePage.goto();
      await expect(page.locator("#nava")).toContainText("PRODUCT STORE");
    });

    await test.step("Select Laptops category", async () => {
      await homePage.selectCategory("Laptops");
    });

    await test.step("Verify product count is greater than 0", async () => {
      const laptopCount = await homePage.getProductCount();
      expect(
        laptopCount,
        `Expected laptops > 0, found ${laptopCount}`,
      ).toBeGreaterThan(0);
    });

    await test.step("Verify only laptop products are displayed", async () => {
      const titles = await homePage.getProductTitles();

      const hasLaptop = expectedLaptops.some((laptop) =>
        titles.some((t) => t.includes(laptop)),
      );
      expect(hasLaptop, "Expected at least one known laptop product").toBe(
        true,
      );

      await homePage.verifyNoCategoryContamination(forbiddenProducts);
    });
  });
});
