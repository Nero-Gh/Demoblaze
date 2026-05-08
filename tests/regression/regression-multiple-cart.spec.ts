import { expect, test } from "../../fixtures/fixtures";
import { HomePage } from "../../page/HomePage";
import { ProductPage } from "../../page/ProductPage";
import { CartPage } from "../../page/CartPage";

test.describe("@regression Regression Test Suite - Cart Operations", () => {
  test("TC-REG-007: Test Adding Multiple Products to Cart", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const products: { name: string; price: number }[] = [];

    await test.step("Add first product to cart", async () => {
      await homePage.goto();
      await expect(homePage.productCards.first()).toBeVisible();

      await homePage.productTitles.nth(0).click();
      await productPage.verifyPageLoaded();

      const name = await productPage.getProductName();
      const price = await productPage.getProductPrice();
      products.push({ name, price });

      page.once("dialog", async (dialog) => {
        expect(dialog.message()).toContain("Product added");
        await dialog.accept();
      });
      await productPage.clickAddToCart();
      await page.waitForTimeout(500);
    });

    await test.step("Navigate back to homepage", async () => {
      await homePage.goto();
      await expect(homePage.productCards.first()).toBeVisible();
    });

    await test.step("Add second product to cart", async () => {
      await homePage.productCards.nth(1).click();
      await productPage.verifyPageLoaded();
      const name = await productPage.getProductName();
      const price = await productPage.getProductPrice();
      products.push({ name, price });

      page.once("dialog", async (dialog) => {
        expect(dialog.message()).toContain("Product added");
        await dialog.accept();
      });
      await productPage.clickAddToCart();
      await page.waitForTimeout(500);
    });

    await test.step("Navigate to cart and verify", async () => {
      await cartPage.clickCartNav();
      const itemCount = await cartPage.getCartItemCount();
      expect(itemCount, `Expected 2 items, found ${itemCount}`).toBe(2);

      const cartNames = await cartPage.getAllProductNames();
      for (const product of products) {
        const found = cartNames.some((name) => name.includes(product.name));
        expect(found, `Expected "${product.name}" in cart`).toBe(true);
      }
      expect(itemCount).toBe(products.length);

      const cartPrices = await cartPage.getAllPrices();
      const cartTotal = await cartPage.getTotalPrice();
      const expectedTotal = products.reduce((sum, p) => sum + p.price, 0);

      expect(
        cartTotal,
        `Expected total ${expectedTotal}, got ${cartTotal}`,
      ).toBe(String(expectedTotal));

      for (let i = 0; i < products.length; i++) {
        expect(cartPrices[i]).toBe(products[i].price);
      }
    });
  });
});
