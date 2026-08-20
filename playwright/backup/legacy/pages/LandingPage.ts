import { Page, expect } from "@playwright/test";

export class LandingPage {
  constructor(private page: Page) {}

  async open() {
    await this.page.goto("http://localhost:5173/");
  }

  async assertHeroVisible() {
    await expect(
      this.page.getByTestId("hero-section").getByRole("heading"),
    ).toContainText("Velô Sprint");
  }
}
