import { Page, expect } from "@playwright/test";

export function createCheckoutActions(page: Page) {
  const terms = page.getByTestId("checkout-terms");

  const alerts = {
    name: page.getByTestId("checkout-name-error"),
    lastname: page.getByTestId("checkout-lastname-error"),
    email: page.getByTestId("checkout-email-error"),
    phone: page.getByTestId("checkout-phone-error"),
    document: page.getByTestId("checkout-document-error"),
    store: page.getByTestId("checkout-store-error"),
    terms: page.getByTestId("checkout-terms-error"),
  };

  return {
    elements: {
      terms,
      alerts,
    },

    async expectLoaded() {
      await expect(
        page.getByRole("heading", { name: "Finalizar Pedido" }),
      ).toBeVisible();
    },

    async expectSummaryTotal(price: string) {
      await expect(page.getByTestId("summary-total-price")).toHaveText(price);
    },

    async expectNoFieldErrors() {
      await expect(alerts.name).toHaveCount(0);
      await expect(alerts.lastname).toHaveCount(0);
      await expect(alerts.email).toHaveCount(0);
      await expect(alerts.phone).toHaveCount(0);
      await expect(alerts.document).toHaveCount(0);
      await expect(alerts.store).toHaveCount(0);
      await expect(alerts.terms).toHaveCount(0);
    },

    async selectCashPayment(method: string) {
      await page.getByRole("button", { name: method }).click();
    },

    async expectCashPaymentPrice(method: string, price: string) {
      await expect(page.getByRole("button", { name: method })).toContainText(
        price,
      );
    },

    async expectSubmitting() {
      const button = page.getByRole("button", { name: "Processando..." });
      await expect(button).toBeVisible();
      await expect(button).toBeDisabled();
    },

    async fillCustomerData(data: {
      name: string;
      lastname: string;
      email: string;
      phone: string;
      document: string;
    }) {
      await page.getByTestId("checkout-name").fill(data.name);
      await page.getByTestId("checkout-lastname").fill(data.lastname);
      await page.getByTestId("checkout-email").fill(data.email);
      await page.getByTestId("checkout-phone").fill(data.phone);
      await page.getByTestId("checkout-document").fill(data.document);
    },

    async selectStore(storeName: string) {
      await page.getByTestId("checkout-store").click();
      await page.getByRole("option", { name: storeName }).click();
    },

    async acceptTerms() {
      await terms.check();
    },

    async submit() {
      await page.getByRole("button", { name: "Confirmar Pedido" }).click();
    },
  };
}
