// Contrato público legado preservado durante a adequação.
export function nomeCliente(cliente) { return String(cliente.nome ?? '').trim() || 'Sem nome' }
