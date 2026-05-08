import { expect, test } from "../../fixtures/fixtures";
import { HomePage } from "../../page/HomePage";
import { ProductPage } from "../../page/ProductPage";
import { CartPage } from "../../page/CartPage";

test.describe("@regression Regression Test Suite - Cart Operations", () => {
  test("TC-REG-008: Test Removing Product from Cart", async ({ page }) => {
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    let productName: string = "";

    await test.step("Precondition: Add product to cart", async () => {
      await homePage.goto();
      await expect(homePage.productCards.first()).toBeVisible();

      await homePage.productTitles.first().click();
      await productPage.verifyPageLoaded();

      productName = await productPage.getProductName();

      page.once("dialog", async (dialog) => {
        expect(dialog.message()).toContain("Product added");
        await dialog.accept();
      });
      await productPage.clickAddToCart();
      await page.waitForTimeout(500);
    });

    await test.step("Navigate to Cart page", async () => {
      await cartPage.clickCartNav();
      const itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBeGreaterThanOrEqual(1);
    });

    await test.step("Click Delete for the product", async () => {
      await expect(cartPage.deleteLinks.first()).toBeVisible();

      await cartPage.deleteProduct(0);
    });

    await test.step("Verify product is removed and cart is empty", async () => {
      const itemCount = await cartPage.getCartItemCount();
      expect(itemCount, "Cart should be empty after deletion").toBe(0);

      const total = await cartPage.getTotalPrice();
      expect(total, "Total should be $0 when cart is empty").toBe("");

      await expect(cartPage.deleteLinks).toHaveCount(0);

      const names = await cartPage.getAllProductNames();
      const stillThere = names.some((n) => n.includes(productName));
      expect(stillThere, `Product "${productName}" should not be in cart`).toBe(
        false,
      );
    });
  });
});
