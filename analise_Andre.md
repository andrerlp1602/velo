# Análise do Projeto - Foco na fase **ACT**

Pelo arquivo enviado, o projeto segue o padrão **AAA (Arrange, Act, Assert)** e já possui uma boa separação entre preparação e validação. :contentReference[oaicite:0]{index=0}

Como solicitado, **não vou sugerir alterações na constante `order`**, nem na massa de testes. O foco será exclusivamente na etapa **Act**.

---

# Situação atual

Hoje todos os testes repetem exatamente os mesmos passos:

```ts
await page
  .getByRole("textbox", { name: "Número do Pedido" })
  .fill(order.number);

await page.getByRole("button", { name: "Buscar Pedido" }).click();
```

Esse trecho aparece diversas vezes ao longo do arquivo. :contentReference[oaicite:1]{index=1} :contentReference[oaicite:2]{index=2} :contentReference[oaicite:3]{index=3} :contentReference[oaicite:4]{index=4}

Isso caracteriza uma violação do princípio **DRY (Don't Repeat Yourself)**.

---

# Problema

Hoje a ação de consultar um pedido é composta por duas etapas:

- preencher o número
- clicar em Buscar

Sempre que essa funcionalidade mudar, será necessário alterar todos os testes.

Exemplo:

Hoje:

```ts
fill(...)
click()
```

Amanhã:

- apertar Enter
- esperar spinner
- clicar em outro botão

Você precisará alterar todos os testes.

---

# Primeira melhoria (recomendada)

Criar um helper responsável pela ação de consultar um pedido.

Exemplo:

```ts
export async function searchOrder(page: Page, orderNumber: string) {
  await page
    .getByRole("textbox", {
      name: "Número do Pedido",
    })
    .fill(orderNumber);

  await page
    .getByRole("button", {
      name: "Buscar Pedido",
    })
    .click();
}
```

Então os testes ficam assim:

```ts
await searchOrder(page, order.number);
```

A etapa Act passa a ter apenas uma linha.

---

# Segunda melhoria

A função acima representa exatamente uma ação do usuário.

Ela pode ficar semanticamente melhor:

```ts
await consultOrder(page, order.number);
```

ou

```ts
await searchOrder(page, order.number);
```

O teste passa a ser praticamente uma frase:

```ts
// Arrange

const order = ...

// Act

await searchOrder(page, order.number);

// Assert
```

Fica extremamente legível.

---

# Terceira melhoria

Hoje você localiza o textbox sempre da mesma forma.

```ts
page.getByRole("textbox", {
  name: "Número do Pedido",
});
```

Esse locator poderia ficar encapsulado.

Exemplo:

```ts
function orderNumberField(page: Page) {
  return page.getByRole("textbox", {
    name: "Número do Pedido",
  });
}
```

Depois:

```ts
await orderNumberField(page).fill(orderNumber);
```

Se o locator mudar, altera apenas um lugar.

---

# Quarta melhoria

O botão também é repetido.

Hoje:

```ts
page.getByRole("button", {
  name: "Buscar Pedido",
});
```

Pode virar:

```ts
function searchButton(page: Page) {
  return page.getByRole("button", {
    name: "Buscar Pedido",
  });
}
```

Depois:

```ts
await searchButton(page).click();
```

---

# Quinta melhoria

Como esses dois elementos sempre trabalham juntos, eles podem virar uma única abstração.

Hoje:

```ts
fill();

click();
```

Depois:

```ts
await searchOrder(page, order.number);
```

O teste deixa de conhecer como funciona a tela.

Ele apenas diz:

> "Consultar pedido"

Isso deixa o teste muito mais próximo da linguagem de negócio.

---

# Sexta melhoria

Hoje existe uma mistura entre:

- localizar elementos
- executar ações

Exemplo:

```ts
page
    .getByRole(...)
    .fill(...)

page
    .getByRole(...)
    .click(...)
```

Seria interessante separar em pequenas funções.

Exemplo:

```ts
fillOrderNumber();

clickSearch();

searchOrder();
```

Onde:

```ts
searchOrder();
```

internamente chama

```ts
fillOrderNumber();

clickSearch();
```

Isso aumenta bastante o reuso.

---

# Sétima melhoria (a que considero ideal)

Como o projeto possui uma pasta `support`, você já começou a centralizar responsabilidades. :contentReference[oaicite:5]{index=5}

Uma evolução natural seria criar um arquivo específico para as ações da tela.

Exemplo:

```
support/

    order.actions.ts
```

ou

```
support/

    order.steps.ts
```

Com algo semelhante a:

```ts
fillOrderNumber();

clickSearch();

searchOrder();
```

Assim o teste fica extremamente enxuto.

---

# O nível seguinte (Page Object)

Embora você tenha pedido para focar apenas no ACT, vale mencionar a evolução natural.

Ao invés de:

```ts
await searchOrder(page, order.number);
```

Você teria:

```ts
await orderPage.search(order.number);
```

Ou:

```ts
await orderPage.search(order);
```

Esse padrão reduz ainda mais o acoplamento dos testes com os detalhes da interface.

---

# Prioridade das melhorias

| Prioridade | Melhoria                         | Ganho                           |
| ---------- | -------------------------------- | ------------------------------- |
| ⭐⭐⭐⭐⭐ | Criar `searchOrder()`            | Muito alto                      |
| ⭐⭐⭐⭐⭐ | Centralizar os locators          | Muito alto                      |
| ⭐⭐⭐⭐☆  | Separar ações (`fill` e `click`) | Alto                            |
| ⭐⭐⭐⭐☆  | Criar `order.actions.ts`         | Alto                            |
| ⭐⭐⭐☆☆   | Evoluir para Page Object         | Alto (quando o projeto crescer) |

---

# Minha recomendação

Neste momento, **eu não partiria diretamente para um Page Object**.

O projeto ainda é pequeno e a melhor relação entre simplicidade e reuso seria:

```
support/
    helpers.ts
    order.actions.ts
```

Dentro de `order.actions.ts` você poderia concentrar apenas as ações da fase **Act**, como:

- `fillOrderNumber()`
- `clickSearch()`
- `searchOrder()`

Essa abordagem elimina praticamente toda a duplicação observada na fase **Act**, melhora a legibilidade dos testes e prepara o projeto para uma futura adoção de **Page Object** sem exigir uma refatoração grande desde já.
