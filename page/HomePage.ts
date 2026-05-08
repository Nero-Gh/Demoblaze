import { expect, Locator, Page } from "@playwright/test";

export class HomePage {
  readonly page: Page;
  readonly categoryList: Locator;
  readonly phonesCategory: Locator;
  readonly laptopsCategory: Locator;
  readonly monitorsCategory: Locator;

  readonly productGrid: Locator;
  readonly productCards: Locator;
  readonly productTitles: Locator;
  readonly nextButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.categoryList = page.locator(".list-group");
    this.phonesCategory = page.locator('a.list-group-item:has-text("Phones")');
    this.laptopsCategory = page.locator(
      'a.list-group-item:has-text("Laptops")',
    );
    this.monitorsCategory = page.locator(
      'a.list-group-item:has-text("Monitors")',
    );

    this.productGrid = page.locator("#tbodyid");
    this.productCards = page.locator("#tbodyid .card");
    this.productTitles = page.locator("#tbodyid .card-title");
    this.nextButton = page.locator("#next2");
  }

  async goto() {
    await this.page.goto("/");
  }

  async selectCategory(categoryName: "Phones" | "Laptops" | "Monitors") {
    const categoryMap = {
      Phones: this.phonesCategory,
      Laptops: this.laptopsCategory,
      Monitors: this.monitorsCategory,
    };

    const categoryLink = categoryMap[categoryName];
    await categoryLink.click();

    await expect(async () => {
      const newCount = await this.productCards.count();
      expect(newCount).toBeGreaterThan(0);
    }).toPass({ timeout: 10000 });
    await expect(categoryMap[categoryName]).toHaveClass(/list-group-item/);
  }

  async getProductCount() {
    return await this.productCards.count();
  }

  async getProductTitles() {
    return await this.productTitles.allTextContents();
  }
  async verifyProductExists(productName: string) {
    const productLink = this.page.locator(
      `.card-title:has-text("${productName}")`,
    );
    await expect(productLink).toBeVisible();
  }

  async verifyNoCategoryContamination(forbiddenProducts: string[]) {
    const titles = await this.getProductTitles();

    for (const forbidden of forbiddenProducts) {
      const found = titles.some((t) =>
        t.toLowerCase().includes(forbidden.toLowerCase()),
      );
      expect(
        found,
        `Found forbidden product "${forbidden}" in filtered results`,
      ).toBe(false);
    }
  }
}
