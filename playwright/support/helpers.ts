const ORDER_CODE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

function randomDigit(): number {
  return Math.floor(Math.random() * 10)
}

export function generateOrderCode(): string {
  let randomPart = ''
  for (let i = 0; i < 6; i++) {
    randomPart += ORDER_CODE_CHARS[Math.floor(Math.random() * ORDER_CODE_CHARS.length)]
  }
  return `VLO-${randomPart}`
}

export function generateCpf(): string {
  const digits = Array.from({ length: 9 }, randomDigit)

  for (const length of [9, 10]) {
    const sum = digits.reduce((acc, digit, index) => acc + digit * (length + 1 - index), 0)
    const rest = (sum * 10) % 11
    digits.push(rest === 10 ? 0 : rest)
  }

  const cpf = digits.join('')
  return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9)}`
}

export function generatePhone(): string {
  const suffix = Array.from({ length: 8 }, randomDigit).join('')
  return `(11) 9${suffix.slice(0, 4)}-${suffix.slice(4)}`
}

export function uniqueEmail(prefix = 'cliente'): string {
  return `${prefix}.${Date.now()}${Math.floor(Math.random() * 1000)}@velo.dev`
}
