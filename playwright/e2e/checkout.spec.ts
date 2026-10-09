import { test, expect } from "../support/fixtures";

test.describe("Checkout", () => {
  test.describe("Validações de campos obrigatórios", () => {
    let alerts: any;

    test.beforeEach(async ({ page, app }) => {
      await page.goto("/order");
      await expect(
        page.getByRole("heading", { name: "Finalizar Pedido" }),
      ).toBeVisible();
      alerts = app.checkout.elements.alerts;
    });

    test("deve validar obrigatoriedade de todos os campos em branco", async ({
      app,
      page,
    }) => {
      // Act
      await app.checkout.submit();

      // Assert
      await expect(alerts.name).toHaveText(
        "Nome deve ter pelo menos 2 caracteres",
      );
      await expect(alerts.lastname).toHaveText(
        "Sobrenome deve ter pelo menos 2 caracteres",
      );
      await expect(alerts.email).toHaveText("Email inválido");
      await expect(alerts.phone).toHaveText("Telefone inválido");
      await expect(alerts.document).toHaveText("CPF inválido");
      await expect(alerts.store).toHaveText("Selecione uma loja");
      await expect(alerts.terms).toHaveText("Aceite os termos");
    });

    test("deve validar limite mínimo de caracteres para Nome e Sobrenome", async ({
      page,
      app,
    }) => {
      const customer = {
        name: "A",
        lastname: "B",
        email: "a@b.com",
        phone: "(11) 99999-9999",
        document: "123.456.789-00",
      };

      // Arrange
      await app.checkout.fillCustomerData(customer);
      await app.checkout.selectStore("Velô Paulista");
      await app.checkout.acceptTerms();

      // Act
      await app.checkout.submit();

      // Assert
      await expect(alerts.name).toHaveText(
        "Nome deve ter pelo menos 2 caracteres",
      );
      await expect(alerts.lastname).toHaveText(
        "Sobrenome deve ter pelo menos 2 caracteres",
      );
    });

    test("deve exibir erro para e-mail com formato inválido", async ({
      page,
      app,
    }) => {
      const customer = {
        name: "André",
        lastname: "Paglione",
        email: "paglione@.com",
        phone: "(11) 99999-9999",
        document: "123.456.789-00",
      };

      // Arrange
      await app.checkout.fillCustomerData(customer);
      await app.checkout.selectStore("Velô Paulista");
      await app.checkout.acceptTerms();

      // Act
      await app.checkout.submit();
      // Assert
      await expect(alerts.email).toHaveText("Email inválido");
    });

    test("deve exibir erro para CPF inválido", async ({ page, app }) => {
      const customer = {
        name: "André",
        lastname: "Paglione",
        email: "paglione@ig.com",
        phone: "(11) 99999-9999",
        document: "123",
      };

      // Arrange
      await app.checkout.fillCustomerData(customer);
      await app.checkout.selectStore("Velô Paulista");
      await app.checkout.acceptTerms();

      // Act
      await app.checkout.submit();

      // Assert
      await expect(alerts.document).toHaveText("CPF inválido");
    });

    test("deve exigir o aceite dos termos ao finalizar com dados válidos", async ({
      page,
      app,
    }) => {
      const customer = {
        name: "André",
        lastname: "Paglione",
        email: "paglione@ig.com",
        phone: "(11) 99999-9999",
        document: "673.831.818-91",
      };

      // Arrange
      await app.checkout.fillCustomerData(customer);
      await app.checkout.selectStore("Velô Paulista");

      await expect(app.checkout.elements.terms).not.toBeChecked(); // Premissa inicial

      // Act
      await app.checkout.submit();

      // Assert
      await expect(alerts.terms).toHaveText("Aceite os termos");
    });
  });

  test("deve aprovar o pedido com pagamento à vista", async ({ app, page }) => {
    const customer = {
      name: "Marina",
      lastname: "Almeida",
      email: "marina.almeida@email.com",
      phone: "(11) 98765-4321",
      document: "673.831.818-91",
      store: "Velô Paulista - Av. Paulista, 1000",
      method: "À Vista",
    };
    const cashPrice = "R$ 40.000,00";
    const configuration = {
      color: "Glacier Blue",
      wheels: /Aero Wheels/,
    };

    // Arrange
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Velô Sprint", level: 1 }),
    ).toBeVisible();
    await page.getByRole("link", { name: "Configure Agora" }).click();

    await expect(page).toHaveURL(/\/configure$/);
    await app.configurator.selectColor(configuration.color);
    await app.configurator.selectWheels(configuration.wheels);
    await expect(
      page.getByRole("checkbox", { name: /Precision Park/i }),
    ).not.toBeChecked();
    await expect(
      page.getByRole("checkbox", { name: /Flux Capacitor/i }),
    ).not.toBeChecked();
    await app.configurator.expectPrice(cashPrice);
    await app.configurator.finishConfigurator();

    await app.checkout.expectLoaded();
    await expect(page).toHaveURL(/\/order$/);
    await app.checkout.expectSummaryTotal(cashPrice);
    await app.checkout.fillCustomerData(customer);
    await app.checkout.selectStore(customer.store);

    await app.checkout.expectNoFieldErrors();

    // Act
    await app.checkout.selectCashPayment(customer.method);
    await app.checkout.expectCashPaymentPrice(customer.method, cashPrice);
    await app.checkout.expectSummaryTotal(cashPrice);
    await app.checkout.acceptTerms();
    await Promise.all([app.checkout.expectSubmitting(), app.checkout.submit()]);

    // Assert
    await expect(page).toHaveURL(/\/success$/);
    await expect(
      page.getByRole("heading", { name: "Pedido Aprovado!" }),
    ).toBeVisible();
    await expect(page.getByText(/^VLO-[A-Z0-9]{6}$/)).toBeVisible();
    await expect(
      page.getByText(`${customer.name} ${customer.lastname}`),
    ).toBeVisible();
    await expect(page.getByText(customer.email)).toBeVisible();
    await expect(page.getByText(customer.store)).toBeVisible();
    await expect(
      page.getByText("Glacier Blue • Interior cream • aero wheels"),
    ).toBeVisible();
    await expect(page.getByText(cashPrice)).toBeVisible();
  });
});
