import { test, expect } from "../support/fixtures";
import { generateOrderModel } from "../support/helpers";

/// AAA - Arrange, Act, Assert

test.describe("Consulta de Pedido", () => {
  test("deve acessar consulta de pedido pela navbar", async ({ app }) => {
    await app.landing.open();
    await app.landing.assertHeroVisible();
    await app.appHeader.goToOrderLookup();
    await app.orderLockup.assertLoaded();
  });

  test.describe("busca de pedido", () => {
    test.beforeEach(async ({ app }) => {
      await app.orderLockup.open();
    });

    test("deve consultar um pedido aprovado", async ({ app }) => {
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
      await app.orderLockup.searchOrder(order.number);

      // Assert
      await app.orderLockup.validateOrderDetails(order);
      await app.orderLockup.validateStatusBadge(order.status);
    });

    test("deve consultar um pedido reprovado", async ({ app }) => {
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
      await app.orderLockup.searchOrder(order.number);

      // Assert
      await app.orderLockup.validateOrderDetails(order);
      await app.orderLockup.validateStatusBadge(order.status);
    });

    test("deve consultar um pedido em analise", async ({ app }) => {
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
      await app.orderLockup.searchOrder(order.number);

      // Assert
      await app.orderLockup.validateOrderDetails(order);
      await app.orderLockup.validateStatusBadge(order.status);
    });

    test("deve exibir mensagem quando o pedido não é encontrado", async ({
      app,
    }) => {
      const order = generateOrderModel();

      await app.orderLockup.searchOrder(order);
      await app.orderLockup.validateOrderNotFound();
    });

    test("deve exibir mensagem quando o código do pedido está fora do padrão", async ({
      app,
    }) => {
      await app.orderLockup.searchOrder("ABC-12345");
      await app.orderLockup.validateOrderNotFound();
    });
  });
});
