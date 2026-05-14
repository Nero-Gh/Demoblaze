import { Locator, Page } from "@playwright/test";
import { expect } from "../fixtures/fixtures";

export class SignUpPage {
  readonly page: Page;

  readonly signUpNavButton: Locator;
  readonly signUpModal: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signUpNavButton = page.locator("#signin2");
    this.signUpModal = page.locator("#signInModal");
    this.usernameInput = page.locator("#sign-username");
    this.passwordInput = page.locator("#sign-password");
    this.submitButton = page.locator("#signInModal button:has-text('Sign up')");
    this.closeButton = page.locator('#signInModal button[aria-label="Close"]');
  }

  async openModal() {
    await this.signUpNavButton.click();
    await expect(this.signUpModal).toBeVisible({ timeout: 5000 });
    await expect(this.usernameInput).toBeVisible();
  }

  async fillForm(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
  }

  async submit() {
    await this.submitButton.click();
  }

  async closeModal() {
    if (await this.signUpModal.isVisible()) {
      await this.page.keyboard.press("Escape");
      await expect(this.signUpModal).toBeHidden({ timeout: 5000 });
    }
  }

  generateUniqueUsername(base: string = "testuser"): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${base}_${timestamp}_${random}`;
  }
}
