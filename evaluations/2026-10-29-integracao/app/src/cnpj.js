export function normalizarCnpj(valor) {
  if (typeof valor !== 'string') return ''
  const texto = valor.trim().toUpperCase()
  if (!/^(?:[A-Z0-9]{12}\d{2}|[A-Z0-9]{2}\.[A-Z0-9]{3}\.[A-Z0-9]{3}\/[A-Z0-9]{4}-\d{2})$/.test(texto)) return ''
  return texto.replace(/[./-]/g, '')
}
export function validarCnpj(valor) {
  const cnpj = normalizarCnpj(valor)
  if (!cnpj || /^(\d)\1{13}$/.test(cnpj)) return false
  function digito(base) {
    let soma = 0; let peso = 2
    for (let indice = base.length - 1; indice >= 0; indice--) { soma += (base.charCodeAt(indice) - 48) * peso; peso = peso === 9 ? 2 : peso + 1 }
    const resto = soma % 11
    return String(resto < 2 ? 0 : 11 - resto)
  }
  const base = cnpj.slice(0, 12); const primeiro = digito(base)
  return cnpj.slice(12) === primeiro + digito(base + primeiro)
}
