import { expect, test } from "../../fixtures/fixtures";
import { LoginPage } from "../../page/LoginPage";

test.describe("@smoke Smoke Test suit", () => {
  test("Homepage loads correctly", async ({ page }) => {
    await page.goto("/");
    const title = page.getByRole("link", { name: "PRODUCT STORE" });
    await expect(title).toBeVisible;
  });

  test("User login with valid credentials", async ({ page, userData }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(
      userData.validUser.username,
      userData.validUser.password,
    );
    const welcomeId = page.locator("#nameofuser");
    const welcomeMessage = `Welcome ${userData.validUser.username}`;

    await expect(welcomeId).toContainText(welcomeMessage);
    await expect(page.locator("#logout2")).toBeVisible();
  });

  test("Verify Logout functionality", async ({ page, userData }) => {
    const loginPage = new LoginPage(page);
    const logoutId = page.locator("#logout2");
    const loginId = page.locator("#login2");

    await test.step("Login with valid credentials", async () => {
      await loginPage.goto();
      await loginPage.login(
        userData.validUser.username,
        userData.validUser.password,
      );
      await expect(page.locator("#logout2")).toBeVisible();
    });
    await test.step("Verify logout functionality", async () => {
      await logoutId.click();
      await expect(loginId).toBeVisible();
    });
  });
});
