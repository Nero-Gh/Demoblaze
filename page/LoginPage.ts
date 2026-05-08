import { Locator, Page } from "@playwright/test";
import { expect } from "../fixtures/fixtures";

export class LoginPage {
  readonly page: Page;
  readonly loginButton: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly loginModal: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginButton = this.page.getByRole("link", { name: "Log in" });
    this.usernameInput = this.page.locator("#loginusername");
    this.passwordInput = this.page.locator("#loginpassword");
    this.submitButton = this.page.getByRole("button", { name: "Log in" });
    this.closeButton = page.getByRole("button", { name: "Close" });
    this.loginModal = page.locator("#logInModal");
  }

  async goto() {
    await this.page.goto("/");
  }

  async closeModal() {
    await this.closeButton.nth(1).click();
    await expect(this.loginModal).not.toBeVisible();
  }

  async login(username: string, password: string) {
    await this.loginButton.click();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
