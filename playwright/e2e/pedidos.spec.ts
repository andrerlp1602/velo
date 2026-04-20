import { test, expect } from '@playwright/test';

test('deve consultar um pedido aprovado', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  //Checkpoint1: Verificar se a página principal está carregada
  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');

  //Checkpoint2: Verificar se o link de consulta de pedido está visível e clicável
  await page.getByRole('link', { name: 'Consultar Pedido' }).click();
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido');

  await page.getByTestId('search-order-id').fill('VLO-DZKG9A');

  
  await page.getByTestId('search-order-button').click();
  await expect(page.getByTestId('order-result-id')).toBeVisible();
  await expect(page.getByTestId('order-result-id')).toContainText('VLO-DZKG9A');
  
  await expect(page.getByTestId('order-result-status')).toBeVisible();
  await expect(page.getByTestId('order-result-status')).toContainText('APROVADO');
});