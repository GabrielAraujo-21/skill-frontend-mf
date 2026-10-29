import { expect, it } from 'vitest'
import { nomeCliente } from './cliente.js'

it('preserva apresentação existente', () => expect(nomeCliente({ nome: ' Ana ' })).toBe('Ana'))
it('aceita cadastro antigo com nome null', () => expect(nomeCliente({ nome: null })).toBe('Sem nome'))
