import { Page, Locator, expect } from "@playwright/test";

export class CartPage {
  readonly page: Page;

  readonly cartTable: Locator;
  readonly cartRows: Locator;
  readonly placeOrderButton: Locator;
  readonly totalPrice: Locator;
  readonly deleteLinks: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartTable = page.getByRole("table");
    this.cartRows = page.locator("tbody tr.success");
    this.placeOrderButton = page.locator('button:has-text("Place Order")');
    this.totalPrice = page.locator("#totalp");
    this.deleteLinks = page.locator('a:has-text("Delete")');
  }

  async goto() {
    await this.page.goto("https://www.demoblaze.com/cart.html");
    await expect(this.cartTable).toBeVisible({ timeout: 10000 });
  }

  async clickCartNav() {
    await this.page.getByRole("link", { name: "Cart", exact: true }).click();
    await expect(this.cartTable).toBeVisible({ timeout: 10000 });
    await expect(this.cartRows.first()).toBeVisible({ timeout: 10000 });
  }

  async getCartItemCount() {
    return await this.cartRows.count();
  }

  async getAllProductNames(): Promise<string[]> {
    const names: string[] = [];
    const count = await this.cartRows.count();
    for (let i = 0; i < count; i++) {
      const name = await this.cartRows
        .nth(i)
        .locator("td")
        .nth(1)
        .textContent();
      if (name) names.push(name.trim());
    }
    return names;
  }

  async getAllPrices(): Promise<number[]> {
    const prices: number[] = [];
    const count = await this.cartRows.count();
    for (let i = 0; i < count; i++) {
      const text =
        (await this.cartRows.nth(i).locator("td").nth(2).textContent()) || "";
      const match = text.match(/(\d+)/);
      if (match) prices.push(parseInt(match[1], 10));
    }
    return prices;
  }

  async getProductNameByRow(rowIndex: number = 0) {
    const nameCell = this.cartRows.nth(rowIndex).locator("td").nth(1);
    return (await nameCell.textContent()) || "";
  }

  async getProductPriceByRow(rowIndex: number = 0) {
    const priceCell = this.cartRows.nth(rowIndex).locator("td").nth(2);
    return (await priceCell.textContent()) || "";
  }

  async getTotalPrice() {
    return (await this.totalPrice.textContent()) || "";
  }

  async verifyProductInCart(expectedName: string) {
    const productRow = this.cartRows.filter({ hasText: expectedName });
    await expect(productRow).toBeVisible({ timeout: 5000 });
  }

  async deleteProduct(rowIndex: number = 0) {
    await this.deleteLinks.nth(rowIndex).click();
    await expect(this.cartRows).toHaveCount(0, { timeout: 10000 });
  }

  async verifyCartEmpty() {
    await expect(this.cartRows).toHaveCount(0, { timeout: 10000 });
    const total = await this.getTotalPrice();
    expect(total).toBe("");
  }
}
