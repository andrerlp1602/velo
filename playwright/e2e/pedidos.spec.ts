import { test, expect } from '@playwright/test';

//AAA - Arrange, Act, Assert

test('deve consultar um pedido aprovado', async ({ page }) => {
  //Arrange: Preparar o cenário
  await page.goto('http://localhost:5173/');
  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');
  await page.getByRole('link', { name: 'Consultar Pedido' }).click();
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido');

  //Act: Executar a ação
  
  //await page.getByLabel('Número do Pedido').fill('VLO-DZKG9A');
  //await page.getByPlaceholder('Ex: VLO-ABC123').fill('VLO-DZKG9A');
  await page.getByRole('textbox', { name: 'Número do Pedido' }).fill('VLO-DZKG9A');
  await page.getByRole('button', { name: 'Buscar Pedido' }).click();

  //Assert: Verificar o resultado

  const orderCode = page.locator('//p[text()="Pedido"]/..//p[text()="VLO-DZKG9A"]');
  await expect(orderCode).toBeVisible({timeout: 10_000});

  const containerPedido = page.getByRole('paragraph')
        .filter({hasText: /^Pedido$/})
        .locator('..');
  
  await expect(containerPedido).toContainText('VLO-DZKG9A');

  await expect(page.getByText('APROVADO')).toBeVisible();

});