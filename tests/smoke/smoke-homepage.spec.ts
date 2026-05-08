// e2e/tests/smoke-category.spec.ts
import { expect, test } from "../../fixtures/fixtures";
import { HomePage } from "../../page/HomePage";

test.describe("@smoke Smoke Test Suite - Category Navigation", () => {
  test("TC-SMOKE-005: Validate Product Category Navigation", async ({
    page,
    userData,
  }) => {
    const homePage = new HomePage(page);
    const phones = userData.categories.phones;
    const laptops = userData.categories.laptops;

    await test.step("Navigate to DemoBlaze homepage", async () => {
      await homePage.goto();
      await expect(page.locator("#nava")).toContainText("PRODUCT STORE");
    });

    await test.step(`Select "${phones.name}" category`, async () => {
      await homePage.selectCategory("Phones");

      const phoneCount = await homePage.getProductCount();
      expect(
        phoneCount,
        `Expected at least ${phones.minCount} phone, found ${phoneCount}`,
      ).toBeGreaterThanOrEqual(phones.minCount);

      for (const product of phones.expectedProducts) {
        await homePage.verifyProductExists(product);
      }
    });

    await test.step(`Select "${laptops.name}" category`, async () => {
      await homePage.selectCategory("Laptops");
      const laptopCount = await homePage.getProductCount();
      expect(
        laptopCount,
        `Expected at least ${laptops.minCount} laptop, found ${laptopCount}`,
      ).toBeGreaterThanOrEqual(laptops.minCount);

      for (const product of laptops.expectedProducts) {
        await homePage.verifyProductExists(product);
      }
    });

    // Step 4: Verify no cross-contamination (optional but recommended)
    await test.step("Verify category isolation", async () => {
      const titles = await homePage.getProductTitles();

      // When on Laptops, we should NOT see phone products
      const hasPhoneProduct = titles.some((t) =>
        userData.categories.phones.expectedProducts.some((p: string) =>
          t.includes(p),
        ),
      );
      expect(
        hasPhoneProduct,
        "Laptops category should not show phone products",
      ).toBe(false);
    });
  });
});
