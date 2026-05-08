import { expect, test } from "../../fixtures/fixtures";
import { HomePage } from "../../page/HomePage";
import { ProductPage } from "../../page/ProductPage";
import { CartPage } from "../../page/CartPage";
import { LoginPage } from "../../page/LoginPage";
import { CheckoutPage } from "../../page/CheckoutPage";

test.describe("@regression Regression Test Suite - Checkout Process", () => {
  test("TC-REG-009: Test Complete Checkout Process", async ({
    page,
    userData,
  }) => {
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const loginPage = new LoginPage(page);
    const checkoutPage = new CheckoutPage(page);

    let cartTotal = 0;
    let productName = "";

    await test.step("Precondition: Log in", async () => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(
        userData.validUser.username,
        userData.validUser.password,
      );
      page.waitForTimeout(500);
      const welcomeId = page.locator("#nameofuser");
      const welcomeMessage = `Welcome ${userData.validUser.username}`;

      await expect(welcomeId).toContainText(welcomeMessage);
    });

    await test.step("Add product to cart", async () => {
      await homePage.goto();
      await expect(homePage.productCards.first()).toBeVisible();

      await homePage.productTitles.first().click();
      await productPage.verifyPageLoaded();

      productName = await productPage.getProductName();
      const productPrice = await productPage.getProductPrice();
      cartTotal = productPrice;

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

      const displayedTotal = await cartPage.getTotalPrice();
      expect(displayedTotal).toBeTruthy();
    });

    await test.step("Open order form", async () => {
      await checkoutPage.openOrderForm();
    });

    await test.step("Fill order form", async () => {
      await checkoutPage.fillOrderForm({
        name: "John Doe",
        country: "United States",
        city: "New York",
        card: "4111111111111111",
        month: "12",
        year: "2026",
      });

      await expect(checkoutPage.nameInput).toHaveValue("John Doe");
      await expect(checkoutPage.cardInput).toHaveValue("4111111111111111");
    });

    await test.step("Click Purchase and verify confirmation", async () => {
      await checkoutPage.clickPurchase();

      await checkoutPage.verifyConfirmationVisible();

      const detailsText = await checkoutPage.getOrderDetailsText();
      const { orderId, amount } = checkoutPage.parseOrderDetails(detailsText);

      expect(orderId.length).toBeGreaterThan(0);
      expect(parseInt(orderId)).toBeGreaterThan(0);

      await checkoutPage.clickOk();
    });

    await test.step("Verify cart is cleared after purchase", async () => {
      await cartPage.goto();
      await cartPage.verifyCartEmpty();
    });
  });
});
