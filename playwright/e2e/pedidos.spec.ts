import { test, expect } from "@playwright/test";
import { generateOrderModel } from "../support/helpers";

import { OrderLockupPage, OrderStatus } from "../support/pages/OrderLockupPage";

///AAA - Arrange, Act, Assert

test.describe("Consulta de Pedido", () => {
  test.beforeEach(async ({ page }) => {
    //Arrange
    await page.goto("http://localhost:5173/");

    //Checkpoint 1: Verificar se o título da página é "Velô Sprint"
    await expect(
      page.getByTestId("hero-section").getByRole("heading"),
    ).toContainText("Velô Sprint");

    //Arrange
    await page.getByRole("link", { name: "Consultar Pedido" }).click();

    //Checkpoint 2: Verificar se a página de consulta de pedidos é carregada
    await expect(page.getByRole("heading")).toContainText("Consultar Pedido");
  });

  test("deve consultar um pedido aprovado", async ({ page }) => {
    //Test Data:
    //const order = "VLO-DZKG9A";

    const order = {
      number: "VLO-DZKG9A",
      status: "APROVADO",
      color: "Midnight Black",
      wheels: "sport Wheels",
      customer: {
        name: "Andre Teste",
        email: "andre@teste.com",
      },
      payment: "À Vista",
    };

    //Act

    const orderLockupPage = new OrderLockupPage(page);
    await orderLockupPage.buscarPedido(order.number);

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
      - paragraph: À Vista
      - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
      `);

    await orderLockupPage.expectStatusBadge(order.status as OrderStatus);
  });

  test("deve consultar um pedido reprovado", async ({ page }) => {
    //Test Data:
    //const order = "VLO-2DCYXE";

    const order = {
      number: "VLO-2DCYXE",
      status: "REPROVADO",
      color: "Midnight Black",
      wheels: "sport Wheels",
      customer: {
        name: "Steve Jobs",
        email: "teste@teste.com.br",
      },
      payment: "À Vista",
    };

    //Act

    const orderLockupPage = new OrderLockupPage(page);
    await orderLockupPage.buscarPedido(order.number);

    //Assert

    // await expect(page.getByText("VLO-DZKG9A")).toBeVisible({
    //   timeout: 10_000,
    // });

    // const containerPedido = page
    //   .getByRole("paragraph")
    //   .filter({ hasText: /^Pedido?/ })
    //   .locator("..");

    // await expect(containerPedido).toContainText(order);

    // await expect(page.getByText("APROVADO")).toBeVisible({
    //   timeout: 10_000,
    // });
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
      - paragraph: À Vista
      - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
      `);

    await orderLockupPage.expectStatusBadge(order.status as OrderStatus);
  });

  test("deve consultar um pedido em analise", async ({ page }) => {
    const order = {
      number: "VLO-E6B8GB",
      status: "EM_ANALISE",
      color: "Glacier Blue",
      wheels: "aero Wheels",
      customer: {
        name: "JASON WHOORES",
        email: "JASON@GMAIL.COM",
      },
      payment: "À Vista",
    };

    //Act
    const orderLockupPage = new OrderLockupPage(page);
    await orderLockupPage.buscarPedido(order.number);

    //Assert

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
      - paragraph: À Vista
      - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
      `);

    await orderLockupPage.expectStatusBadge(order.status as OrderStatus);
  });

  test("deve exibir mensagem quando o pedido não é encontrado", async ({
    page,
  }) => {
    const order = generateOrderModel();

    const orderLockupPage = new OrderLockupPage(page);
    await orderLockupPage.buscarPedido(order);

    // await expect(page.locator("#root")).toContainText("Pedido não encontrado");
    // await expect(page.locator("#root")).toContainText(
    //   "Verifique o número do pedido e tente novamente",
    // );

    const title = page.getByRole("heading", { name: "Pedido não encontrado" });
    await expect(title).toBeVisible();

    //const message = page.locator('//p[text()="Verifique o número do pedido e tente novamente"]');
    // const message = page.locator("p", {
    //   hasText: "Verifique o número do pedido e tente novamente",
    // });
    // await expect(message).toBeVisible();
    await expect(page.locator("#root")).toMatchAriaSnapshot(`
      - img
      - heading "Pedido não encontrado" [level=3]
      - paragraph: Verifique o número do pedido e tente novamente
      `);
  });
});
