import { Locator, Page, expect } from '@playwright/test'

export type CheckoutField = 'name' | 'surname' | 'email' | 'phone' | 'cpf' | 'store' | 'terms'

export type CheckoutForm = {
  name: string
  surname: string
  email: string
  phone: string
  cpf: string
  store: string
  acceptTerms: boolean
}

export function createCheckoutActions(page: Page) {
  const elements = {
    heading: page.getByRole('heading', { name: 'Finalizar Pedido' }),
    nameInput: page.getByRole('textbox', { name: 'Nome', exact: true }),
    surnameInput: page.getByRole('textbox', { name: 'Sobrenome', exact: true }),
    emailInput: page.getByRole('textbox', { name: 'Email', exact: true }),
    phoneInput: page.getByRole('textbox', { name: 'Telefone', exact: true }),
    cpfInput: page.getByRole('textbox', { name: 'CPF', exact: true }),
    storeSelect: page.getByRole('combobox', { name: 'Loja para Retirada', exact: true }),
    storeOption: (name: string) => page.getByRole('option', { name }),
    termsCheckbox: page.getByRole('checkbox', { name: /Li e aceito os/i }),
    submitButton: page.getByRole('button', { name: 'Confirmar Pedido', exact: true }),
    summaryTotalPrice: page.getByTestId('summary-total-price'),
    successStatus: page.getByTestId('success-status'),
    successOrderNumber: page.getByTestId('order-id'),
  }

  const fields: Record<CheckoutField, Locator> = {
    name: elements.nameInput,
    surname: elements.surnameInput,
    email: elements.emailInput,
    phone: elements.phoneInput,
    cpf: elements.cpfInput,
    store: elements.storeSelect,
    terms: elements.termsCheckbox,
  }

  async function expectLoaded(): Promise<void> {
    await expect(elements.heading).toBeVisible()
  }

  async function selectStore(storeName: string): Promise<void> {
    await elements.storeSelect.click()
    await elements.storeOption(storeName).click()
  }

  async function expectValidationError(
    field: CheckoutField,
    message: string,
    { soft = false }: { soft?: boolean } = {},
  ): Promise<void> {
    if (soft) {
      await expect.soft(fields[field]).toHaveAccessibleDescription(message)
    } else {
      await expect(fields[field]).toHaveAccessibleDescription(message)
    }
  }

  return {
    elements,

    async open(): Promise<void> {
      await page.goto('/order')
      await expectLoaded()
    },

    expectLoaded,

    async fillName(name: string): Promise<void> {
      await elements.nameInput.fill(name)
    },

    async fillSurname(surname: string): Promise<void> {
      await elements.surnameInput.fill(surname)
    },

    async fillEmail(email: string): Promise<void> {
      await elements.emailInput.fill(email)
    },

    async fillPhone(phone: string): Promise<void> {
      await elements.phoneInput.fill(phone)
    },

    async fillCpf(cpf: string): Promise<void> {
      await elements.cpfInput.fill(cpf)
    },

    selectStore,

    async toggleTerms(checked = true): Promise<void> {
      await elements.termsCheckbox.setChecked(checked)
    },

    /** Preenche apenas os campos informados, na ordem do formulário. */
    async fillForm(form: Partial<CheckoutForm>): Promise<void> {
      if (form.name !== undefined) await elements.nameInput.fill(form.name)
      if (form.surname !== undefined) await elements.surnameInput.fill(form.surname)
      if (form.email !== undefined) await elements.emailInput.fill(form.email)
      if (form.phone !== undefined) await elements.phoneInput.fill(form.phone)
      if (form.cpf !== undefined) await elements.cpfInput.fill(form.cpf)
      if (form.store !== undefined) await selectStore(form.store)
      if (form.acceptTerms !== undefined) await elements.termsCheckbox.setChecked(form.acceptTerms)
    },

    async submit(): Promise<void> {
      await elements.submitButton.click()
    },

    expectValidationError,

    async expectRequiredErrors(): Promise<void> {
      const soft = { soft: true }
      await expectValidationError('name', 'Nome deve ter pelo menos 2 caracteres', soft)
      await expectValidationError('surname', 'Sobrenome deve ter pelo menos 2 caracteres', soft)
      await expectValidationError('email', 'Email inválido', soft)
      await expectValidationError('phone', 'Telefone inválido', soft)
      await expectValidationError('cpf', 'CPF inválido', soft)
      await expectValidationError('store', 'Selecione uma loja', soft)
      await expectValidationError('terms', 'Aceite os termos', soft)
    },

    async expectNotSubmitted(): Promise<void> {
      await expect(page).toHaveURL(/\/order$/)
      await expectLoaded()
    },

    async expectSummaryTotal(price: string): Promise<void> {
      await expect(elements.summaryTotalPrice).toHaveText(price)
    },

    /** Retorna o número do pedido exibido na tela de sucesso. */
    async expectOrderApproved(): Promise<string> {
      await expect(page).toHaveURL(/\/success$/)
      await expect(elements.successStatus).toHaveText('Pedido Aprovado!')
      await expect(elements.successOrderNumber).toHaveText(/^VLO-[A-Z0-9]{6}$/)
      return (await elements.successOrderNumber.textContent())!.trim()
    },
  }
}
