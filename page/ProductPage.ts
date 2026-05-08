import { Page, Locator, expect } from "@playwright/test";

export class ProductPage {
  readonly page: Page;

  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly productDescription: Locator;
  readonly addToCartButton: Locator;
  readonly productImage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productName = page.locator(".name");
    this.productPrice = page.locator(".price-container");
    this.productDescription = page.locator("#more-information");
    this.addToCartButton = page.getByRole("link", { name: "Add to cart" });
    this.productImage = page.locator(".item.active img");
  }

  async getProductName() {
    return (await this.productName.textContent()) || "";
  }

  // async getProductPrice() {
  //   const priceText = (await this.productPrice.textContent()) || "";
  //   return priceText.split("*")[0].trim();
  // }

  async getProductPrice(): Promise<number> {
    const text = (await this.productPrice.textContent()) || "";
    const match = text.match(/\$(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  async clickAddToCart() {
    await this.addToCartButton.click();
  }

  async verifyPageLoaded() {
    await expect(this.productName).toBeVisible({ timeout: 10000 });
    await expect(this.addToCartButton).toBeVisible();
    await expect(this.productImage).toBeVisible();
  }
}
