import { Page, Locator, expect } from "@playwright/test";

export class CheckoutPage {
  readonly page: Page;

  readonly placeOrderButton: Locator;
  readonly orderModal: Locator;
  readonly nameInput: Locator;
  readonly countryInput: Locator;
  readonly cityInput: Locator;
  readonly cardInput: Locator;
  readonly monthInput: Locator;
  readonly yearInput: Locator;
  readonly purchaseButton: Locator;
  readonly closeButton: Locator;

  readonly confirmationModal: Locator;
  readonly confirmationTitle: Locator;
  readonly orderDetails: Locator;
  readonly okButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.placeOrderButton = page.locator('button:has-text("Place Order")');
    this.orderModal = page.locator("#orderModal");
    this.nameInput = page.locator("#name");
    this.countryInput = page.locator("#country");
    this.cityInput = page.locator("#city");
    this.cardInput = page.locator("#card");
    this.monthInput = page.locator("#month");
    this.yearInput = page.locator("#year");
    this.purchaseButton = page.locator(
      "#orderModal button:has-text('Purchase')",
    );
    this.closeButton = page.locator("#orderModal button:has-text('Close')");

    this.confirmationModal = page.locator(".sweet-alert");
    this.confirmationTitle = page.locator(".sweet-alert h2");
    this.orderDetails = page.locator(".sweet-alert p.lead.text-muted");
    this.okButton = page.getByRole("button", { name: "OK" });
  }

  async openOrderForm(): Promise<void> {
    await this.placeOrderButton.click();
    await expect(this.orderModal).toBeVisible({ timeout: 5000 });
    await expect(this.nameInput).toBeVisible();
  }

  async fillOrderForm(data: {
    name: string;
    country: string;
    city: string;
    card: string;
    month: string;
    year: string;
  }): Promise<void> {
    await this.nameInput.fill(data.name);
    await this.countryInput.fill(data.country);
    await this.cityInput.fill(data.city);
    await this.cardInput.fill(data.card);
    await this.monthInput.fill(data.month);
    await this.yearInput.fill(data.year);
  }

  async clickPurchase(): Promise<void> {
    await this.purchaseButton.click();
  }

  async verifyConfirmationVisible(): Promise<void> {
    await expect(this.confirmationModal).toBeVisible({ timeout: 10000 });
    await expect(this.confirmationTitle).toHaveText(
      "Thank you for your purchase!",
    );
  }

  async getOrderDetailsText(): Promise<string> {
    return (await this.orderDetails.textContent()) || "";
  }

  parseOrderDetails(text: string): { orderId: string; amount: number } {
    const idMatch = text.match(/Id:\s*(\d+)/);
    const amountMatch = text.match(/Amount:\s*(\d+)/);

    return {
      orderId: idMatch ? idMatch[1] : "",
      amount: amountMatch ? parseInt(amountMatch[1], 10) : 0,
    };
  }

  async clickOk(): Promise<void> {
    await this.okButton.click();
    await expect(this.confirmationModal).not.toBeVisible({ timeout: 5000 });
    await this.page.goto("/");
  }
}
