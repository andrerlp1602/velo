import { test, expect } from "@playwright/test";

import { generateOrderModel } from "../support/helpers";

import { OrderLockupPage } from "../support/pages/OrderLockupPage";

/// AAA - Arrange, Act, Assert

test.describe("Consulta de Pedido", () => {
  test.beforeEach(async ({ page }) => {
    // Arrange
    await page.goto("http://localhost:5173/");
    await expect(
      page.getByTestId("hero-section").getByRole("heading"),
    ).toContainText("Velô Sprint");

    await page.getByRole("link", { name: "Consultar Pedido" }).click();
    await expect(page.getByRole("heading")).toContainText("Consultar Pedido");
  });

  test("deve consultar um pedido aprovado", async ({ page }) => {
    // Test Data
    const order = {
      number: "VLO-DZKG9A",
      status: "APROVADO" as const,
      color: "Midnight Black",
      wheels: "sport Wheels",
      customer: {
        name: "Andre Teste",
        email: "andre@teste.com",
      },
      payment: "À Vista",
    };

    // Act
    const orderLockupPage = new OrderLockupPage(page);
    await orderLockupPage.searchOrder(order.number);

    // Assert
    await expect(page.getByTestId(`order-result-${order.number}`))
      .toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - paragraph: ${order.number}
      - status:
        - img
        - text: ${order.status}
      - img "Velô Sprint"
      - paragraph: Modelo
      - paragraph: Velô Sprint
      - paragraph: Cor
      - paragraph: ${order.color}
      - paragraph: Interior
      - paragraph: cream
      - paragraph: Rodas
      - paragraph: ${order.wheels}
      - heading "Dados do Cliente" [level=4]
      - paragraph: Nome
      - paragraph: ${order.customer.name}
      - paragraph: Email
      - paragraph: ${order.customer.email}
      - paragraph: Loja de Retirada
      - paragraph
      - paragraph: Data do Pedido
      - paragraph: /\\d+\\/\\d+\\/\\d+/
      - heading "Pagamento" [level=4]
      - paragraph: ${order.payment}
      - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
      `);

    // Validação do badge de status encapsulada no Page Object
    await orderLockupPage.validateStatusBadge(order.status);
  });

  test("deve consultar um pedido reprovado", async ({ page }) => {
    // Test Data
    const order = {
      number: "VLO-2DCYXE",
      status: "REPROVADO" as const,
      color: "Midnight Black",
      wheels: "sport Wheels",
      customer: {
        name: "Steve Jobs",
        email: "teste@teste.com.br",
      },
      payment: "À Vista",
    };

    // Act
    const orderLockupPage = new OrderLockupPage(page);
    await orderLockupPage.searchOrder(order.number);

    // Assert
    await expect(page.getByTestId(`order-result-${order.number}`))
      .toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - paragraph: ${order.number}
      - status:
        - img
        - text: ${order.status}
      - img "Velô Sprint"
      - paragraph: Modelo
      - paragraph: Velô Sprint
      - paragraph: Cor
      - paragraph: ${order.color}
      - paragraph: Interior
      - paragraph: cream
      - paragraph: Rodas
      - paragraph: ${order.wheels}
      - heading "Dados do Cliente" [level=4]
      - paragraph: Nome
      - paragraph: ${order.customer.name}
      - paragraph: Email
      - paragraph: ${order.customer.email}
      - paragraph: Loja de Retirada
      - paragraph
      - paragraph: Data do Pedido
      - paragraph: /\\d+\\/\\d+\\/\\d+/
      - heading "Pagamento" [level=4]
      - paragraph: ${order.payment}
      - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
      `);

    // Validação do badge de status encapsulada no Page Object
    await orderLockupPage.validateStatusBadge(order.status);
  });

  test("deve consultar um pedido em analise", async ({ page }) => {
    // Test Data
    const order = {
      number: "VLO-E6B8GB",
      status: "EM_ANALISE" as const,
      color: "Glacier Blue",
      wheels: "aero Wheels",
      customer: {
        name: "JASON WHOORES",
        email: "JASON@GMAIL.COM",
      },
      payment: "À Vista",
    };

    // Act
    const orderLockupPage = new OrderLockupPage(page);
    await orderLockupPage.searchOrder(order.number);

    // Assert
    await expect(page.getByTestId(`order-result-${order.number}`))
      .toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - paragraph: ${order.number}
      - status:
        - img
        - text: ${order.status}
      - img "Velô Sprint"
      - paragraph: Modelo
      - paragraph: Velô Sprint
      - paragraph: Cor
      - paragraph: ${order.color}
      - paragraph: Interior
      - paragraph: cream
      - paragraph: Rodas
      - paragraph: ${order.wheels}
      - heading "Dados do Cliente" [level=4]
      - paragraph: Nome
      - paragraph: ${order.customer.name}
      - paragraph: Email
      - paragraph: ${order.customer.email}
      - paragraph: Loja de Retirada
      - paragraph
      - paragraph: Data do Pedido
      - paragraph: /\\d+\\/\\d+\\/\\d+/
      - heading "Pagamento" [level=4]
      - paragraph: ${order.payment}
      - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
      `);

    // Validação do badge de status encapsulada no Page Object
    await orderLockupPage.validateStatusBadge(order.status);
  });

  test("deve exibir mensagem quando o pedido não é encontrado", async ({
    page,
  }) => {
    const order = generateOrderModel();

    const orderLockupPage = new OrderLockupPage(page);
    await orderLockupPage.searchOrder(order);

    await expect(page.locator("#root")).toMatchAriaSnapshot(`
      - img
      - heading "Pedido não encontrado" [level=3]
      - paragraph: Verifique o número do pedido e tente novamente
      `);
  });
});
