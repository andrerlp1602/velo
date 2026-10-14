export function brlPricePattern(value: string | number): RegExp {
    const amount = Number(value).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
    const escaped = amount.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

    return new RegExp(`R\\$\\s*${escaped}`)
}

export function generateOrderCode() {
    const prefix = 'VLO'

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let randomPart = ''

    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length)
        randomPart += chars[randomIndex]
    }

    return `${prefix}-${randomPart}`
}