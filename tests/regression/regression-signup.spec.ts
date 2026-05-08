import { expect, test } from "../../fixtures/fixtures";
import { SignUpPage } from "../../page/SignUpPage";
import { HomePage } from "../../page/HomePage";
import { LoginPage } from "../../page/LoginPage";

test.describe("@regression Regression Test Suite - User Registration", () => {
  test("TC-REG-001: Validate User Registration with Valid Data", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const signUpPage = new SignUpPage(page);
    const loginPage = new LoginPage(page);

    const newUsername = signUpPage.generateUniqueUsername("reguser");
    const newPassword = "TestPass123!";

    await test.step("Navigate to homepage", async () => {
      await homePage.goto();
      await expect(page.locator("#nava")).toContainText("PRODUCT STORE");
    });

    await test.step("Open sign-up modal", async () => {
      await signUpPage.openModal();
    });

    await test.step("Fill registration form", async () => {
      await signUpPage.fillForm(newUsername, newPassword);
      await expect(signUpPage.usernameInput).toHaveValue(newUsername);
      await expect(signUpPage.passwordInput).toHaveValue(newPassword);
    });
    await test.step("Submit registration and verify alert", async () => {
      const dialogPromise = page.waitForEvent("dialog", { timeout: 10000 });

      await signUpPage.submit();

      const dialog = await dialogPromise;
      expect(dialog.message()).toContain("Sign up successful");
      await dialog.accept();
    });

    await test.step("Verify new account can log in", async () => {
      if (await signUpPage.signUpModal.isVisible()) {
        await signUpPage.closeModal();
      }

      await loginPage.login(newUsername, newPassword);

      await expect(page.locator("#nameofuser")).toContainText(
        `Welcome ${newUsername}`,
        { timeout: 5000 },
      );
    });
  });
});

test.describe("@regression Regression Test Suite - User Registration", () => {
  test("TC-REG-002: Validate Registration with Existing Username", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const signUpPage = new SignUpPage(page);
    const loginPage = new LoginPage(page);

    const existingUsername = signUpPage.generateUniqueUsername("existing");
    const password = "TestPass123!";

    await test.step("Setup: Create a user account", async () => {
      await homePage.goto();
      await signUpPage.openModal();
      await signUpPage.fillForm(existingUsername, password);

      await signUpPage.submit();

      const setupDialog = page.waitForEvent("dialog");
      const dialog = await setupDialog;
      expect(dialog.message()).toContain("Sign up successful");
      await dialog.accept();
    });

    await test.step("Open sign-up modal", async () => {
      if (await signUpPage.signUpModal.isVisible()) {
        await signUpPage.closeModal();
      }
      await signUpPage.openModal();
    });

    await test.step("Fill form with existing username", async () => {
      await signUpPage.fillForm(existingUsername, password);
      await expect(signUpPage.usernameInput).toHaveValue(existingUsername);
    });

    await test.step("Submit and verify duplicate error alert", async () => {
      const dialogPromise = page.waitForEvent("dialog");
      await signUpPage.submit();
      const dialog = await dialogPromise;
      expect(dialog.message().trim()).toBe("This user already exist.");
      await dialog.accept();
    });

    await test.step("Verify account is not duplicated (login still works)", async () => {
      await signUpPage.closeModal();
      await loginPage.login(existingUsername, password);
      await expect(page.locator("#nameofuser")).toContainText(
        `Welcome ${existingUsername}`,
      );
    });
  });
});

test.describe("@regression Regression Test Suite - User Registration", () => {
  test("TC-REG-003: Validate Registration with Empty Fields", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const signUpPage = new SignUpPage(page);

    await test.step("Navigate to homepage", async () => {
      await homePage.goto();
      await expect(page.locator("#nava")).toContainText("PRODUCT STORE");
    });

    await test.step("Open sign-up modal", async () => {
      await signUpPage.openModal();
    });

    await test.step("Ensure fields are empty", async () => {
      await signUpPage.usernameInput.fill("");
      await signUpPage.passwordInput.fill("");

      await expect(signUpPage.usernameInput).toHaveValue("");
      await expect(signUpPage.passwordInput).toHaveValue("");
    });

    await test.step("Submit empty form and verify validation alert", async () => {
      page.once("dialog", async (dialog) => {
        expect(dialog.message().trim()).toBe(
          "Please fill out Username and Password.",
        );
        await dialog.accept();
      });

      await signUpPage.submit();

      await expect(signUpPage.signUpModal).toBeVisible();
    });

    await test.step("Verify registration was not processed", async () => {
      await expect(signUpPage.signUpModal).toBeVisible();
      await expect(signUpPage.usernameInput).toHaveValue("");
      await expect(signUpPage.passwordInput).toHaveValue("");
    });
  });
});
