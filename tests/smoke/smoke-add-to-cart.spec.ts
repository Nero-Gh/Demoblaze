import { expect, test } from "../../fixtures/fixtures";
import { CartPage } from "../../page/CartPage";
import { HomePage } from "../../page/HomePage";
import { ProductPage } from "../../page/ProductPage";

test.describe("@smoke Smoke Test Suite - Add to Cart", () => {
  test("TC-SMOKE-003: Confirm Product Can Be Added to Cart", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    let capturedProductName = "";

    await test.step("Navigate to homepage", async () => {
      await homePage.goto();
      await expect(page.locator("#nava")).toContainText("PRODUCT STORE");
    });

    await test.step("Click first product", async () => {
      await expect(homePage.productCards.first()).toBeVisible();
      await homePage.productTitles.first().click();
      await page.waitForLoadState("load");
    });

    await test.step("Verify product details page", async () => {
      await productPage.verifyPageLoaded();
    });

    await test.step("Add product to cart", async () => {
      page.once("dialog", async (dialog) => {
        expect(dialog.message()).toContain("Product added");
        await dialog.accept();
      });

      await productPage.clickAddToCart();
      await page.waitForTimeout(500);
    });

    await test.step("Navigate to cart page", async () => {
      await cartPage.clickCartNav();

      const itemCount = await cartPage.getCartItemCount();
      expect(
        itemCount,
        "Cart should contain at least 1 item",
      ).toBeGreaterThanOrEqual(1);
    });

    await test.step("Verify product in cart", async () => {
      await cartPage.verifyProductInCart(capturedProductName);
      const cartTotal = await cartPage.getTotalPrice();
      expect(cartTotal).toBeTruthy();
    });
  });
});
