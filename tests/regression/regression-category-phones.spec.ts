import { expect, test } from "../../fixtures/fixtures";
import { HomePage } from "../../page/HomePage";

test.describe("@regression Regression Test Suite - Product Category", () => {
  test("TC-REG-004: Verify Product Search by Category - Phones", async ({
    page,
    userData,
  }) => {
    const homePage = new HomePage(page);

    const expectedPhones = userData.categories.phones.expectedProducts;
    const forbiddenProducts = userData.categories.laptops.expectedProducts;

    await test.step("Navigate to homepage", async () => {
      await homePage.goto();
      await expect(page.locator("#nava")).toContainText("PRODUCT STORE");
    });

    await test.step("Select Phones category", async () => {
      await homePage.selectCategory("Phones");
    });

    await test.step("Verify product count is greater than 0", async () => {
      const phoneCount = await homePage.getProductCount();
      expect(
        phoneCount,
        `Expected phones > 0, found ${phoneCount}`,
      ).toBeGreaterThan(0);
    });

    await test.step("Verify only phone products are displayed", async () => {
      const titles = await homePage.getProductTitles();
      const hasPhoneProduct = expectedPhones.some((phone) =>
        titles.some((t) => t.includes(phone)),
      );
      page.waitForTimeout(1000);
      expect(hasPhoneProduct, "Expected at least one known phone product").toBe(
        true,
      );

      await homePage.verifyNoCategoryContamination(forbiddenProducts);
    });
  });
});
