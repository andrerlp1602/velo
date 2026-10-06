import { test, expect } from '../support/fixtures'
import { generateCpf, uniqueEmail } from '../support/helpers'

const STORE = 'Velô Paulista - Av. Paulista, 1000'

test.describe('Checkout - Validação de Campos Obrigatórios e Dados Inválidos (CT04)', () => {
  test.beforeEach(async ({ app }) => {
    await app.checkout.open()
  })

  test('deve exibir mensagens de erro para todos os campos obrigatórios ao submeter formulário em branco', async ({
    app,
  }) => {
    await app.checkout.submit()

    await app.checkout.expectRequiredErrors()
    await app.checkout.expectNotSubmitted()
  })

  test('deve validar quantidade mínima de 2 caracteres para Nome e Sobrenome', async ({ app }) => {
    await app.checkout.fillForm({ name: 'A', surname: 'B' })
    await app.checkout.submit()

    await app.checkout.expectValidationError('name', 'Nome deve ter pelo menos 2 caracteres')
    await app.checkout.expectValidationError(
      'surname',
      'Sobrenome deve ter pelo menos 2 caracteres',
    )
    await app.checkout.expectNotSubmitted()
  })

  test('deve validar inserção de e-mail sem formato válido', async ({ app }) => {
    // HTML5 type=email bloqueia "cliente@.com" antes do Zod; "cliente@com" chega ao Zod.
    await app.checkout.fillForm({ name: 'João', surname: 'Silva', email: 'cliente@com' })
    await app.checkout.submit()

    await app.checkout.expectValidationError('email', 'Email inválido')
    await app.checkout.expectNotSubmitted()
  })

  test('deve validar CPF incompleto ou inválido', async ({ app }) => {
    await app.checkout.fillForm({ name: 'João', surname: 'Silva', email: 'joao.silva@exemplo.com' })
    await app.checkout.submit()

    await app.checkout.expectValidationError('cpf', 'CPF inválido')
    await app.checkout.expectNotSubmitted()
  })

  test('deve exigir o aceite dos Termos de Uso quando os demais dados estiverem preenchidos', async ({
    app,
  }) => {
    await app.checkout.fillForm({
      name: 'João',
      surname: 'Silva',
      email: 'joao.silva@exemplo.com',
      phone: '11999998888',
      cpf: '123.456.789-00',
      store: STORE,
    })
    await app.checkout.submit()

    await app.checkout.expectValidationError('terms', 'Aceite os termos')
    await app.checkout.expectNotSubmitted()
  })
})

test.describe('Checkout - Pedido à vista', () => {
  test('deve confirmar o pedido e gravá-lo como aprovado', async ({ app, orders }) => {
    const customer = {
      name: 'João',
      surname: 'Silva',
      email: uniqueEmail('joao'),
      phone: '11999998888',
      cpf: generateCpf(),
      store: STORE,
      acceptTerms: true,
    }

    await test.step('preencher dados do cliente e aceitar os termos', async () => {
      await app.checkout.open()
      await app.checkout.expectSummaryTotal('R$ 40.000,00')
      await app.checkout.fillForm(customer)
    })

    const orderNumber = await test.step('confirmar pedido e validar tela de sucesso', async () => {
      await app.checkout.submit()
      return app.checkout.expectOrderApproved()
    })

    orders.track(orderNumber)

    await test.step('validar pedido gravado no banco', async () => {
      const row = await orders.findByNumber(orderNumber)
      expect(row).toMatchObject({
        status: 'APROVADO',
        payment_method: 'avista',
        customer_name: `${customer.name} ${customer.surname}`,
        customer_email: customer.email,
        customer_cpf: customer.cpf,
      })
      expect(Number(row?.total_price)).toBe(40000)
    })
  })
})
