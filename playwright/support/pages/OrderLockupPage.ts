import { Page, Locator, expect } from "@playwright/test";

export type OrderStatus = "APROVADO" | "REPROVADO" | "EM_ANALISE";

interface StatusBadgeStyle {
  bgClass: RegExp;
  textClass: RegExp;
  iconClass: RegExp;
}

// Mapa único de verdade para o estilo esperado de cada status.
// Qualquer novo status entra aqui, sem precisar tocar nos testes.
const STATUS_BADGE_STYLES: Record<OrderStatus, StatusBadgeStyle> = {
  APROVADO: {
    bgClass: /bg-green-100/,
    textClass: /text-green-700/,
    iconClass: /lucide-circle-check-big/,
  },
  REPROVADO: {
    bgClass: /bg-red-100/,
    textClass: /text-red-700/,
    iconClass: /lucide-circle-x/,
  },
  EM_ANALISE: {
    bgClass: /bg-amber-100/,
    textClass: /text-amber-700/,
    iconClass: /lucide-clock/,
  },
};

export class OrderLockupPage {
  constructor(private page: Page) {}

  async buscarPedido(numero: string) {
    await this.page
      .getByRole("textbox", { name: "Número do Pedido" })
      .fill(numero);
    await this.page.getByRole("button", { name: "Buscar Pedido" }).click();
  }

  /**
   * Locator do badge de status, filtrado pelo texto do status informado.
   */
  statusBadge(status: string): Locator {
    return this.page.getByRole("status").filter({ hasText: status });
  }

  /**
   * Valida cor de fundo, cor do texto e ícone do badge de status,
   * de acordo com o mapeamento de estilo esperado para cada status.
   */
  async expectStatusBadge(status: OrderStatus): Promise<void> {
    const style = STATUS_BADGE_STYLES[status];
    if (!style) {
      throw new Error(
        `Nenhum estilo de badge mapeado para o status "${status}". ` +
          `Atualize STATUS_BADGE_STYLES em OrderLockupPage.ts.`,
      );
    }

    const badge = this.statusBadge(status);
    await expect(badge).toHaveClass(style.bgClass);
    await expect(badge).toHaveClass(style.textClass);

    const icon = badge.locator("svg");
    await expect(icon).toHaveClass(style.iconClass);
  }
}
