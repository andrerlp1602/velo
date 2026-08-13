import { test } from "@playwright/test";

import { AppHeader } from "../support/components/AppHeader";
import { generateOrderModel } from "../support/helpers";
import { LandingPage } from "../support/pages/LandingPage";
import { OrderLockupPage } from "../support/pages/OrderLockupPage";

/// AAA - Arrange, Act, Assert

test.describe("Consulta de Pedido", () => {
  test("deve acessar consulta de pedido pela navbar", async ({ page }) => {
    const landingPage = new LandingPage(page);
    const appHeader = new AppHeader(page);
    const orderLockupPage = new OrderLockupPage(page);

    await landingPage.open();
    await landingPage.assertHeroVisible();
    await appHeader.goToOrderLookup();
    await orderLockupPage.assertLoaded();
  });

  test.describe("busca de pedido", () => {
    let orderLockupPage: OrderLockupPage;

    test.beforeEach(async ({ page }) => {
      orderLockupPage = new OrderLockupPage(page);
      await orderLockupPage.open();
    });

    test("deve consultar um pedido aprovado", async () => {
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
      await orderLockupPage.searchOrder(order.number);

      // Assert
      await orderLockupPage.validateOrderDetails(order);
      await orderLockupPage.validateStatusBadge(order.status);
    });

    test("deve consultar um pedido reprovado", async () => {
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
      await orderLockupPage.searchOrder(order.number);

      // Assert
      await orderLockupPage.validateOrderDetails(order);
      await orderLockupPage.validateStatusBadge(order.status);
    });

    test("deve consultar um pedido em analise", async () => {
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
      await orderLockupPage.searchOrder(order.number);

      // Assert
      await orderLockupPage.validateOrderDetails(order);
      await orderLockupPage.validateStatusBadge(order.status);
    });

    test("deve exibir mensagem quando o pedido não é encontrado", async () => {
      const order = generateOrderModel();

      await orderLockupPage.searchOrder(order);
      await orderLockupPage.validateOrderNotFound();
    });

    test("deve exibir mensagem quando o código do pedido está fora do padrão", async () => {
      await orderLockupPage.searchOrder("ABC-12345");
      await orderLockupPage.validateOrderNotFound();
    });
  });
});
