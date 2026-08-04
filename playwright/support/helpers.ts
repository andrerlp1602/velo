export function generateOrderModel() {
  const alphaNumeric = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  // Gera apenas os 6 caracteres alfanuméricos finais
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += alphaNumeric.charAt(
      Math.floor(Math.random() * alphaNumeric.length),
    );
  }

  // Retorna o prefixo fixo "VLO-" concatenado com o sufixo aleatório
  return `VLO-${suffix}`;
}
