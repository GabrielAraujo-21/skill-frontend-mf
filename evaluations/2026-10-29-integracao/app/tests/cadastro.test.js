import { expect, it } from 'vitest'
import { validarCnpj, normalizarCnpj } from '../src/cnpj.js'
import { nomeCliente } from '../src/cliente.js'

it.each(['04.252.011/0001-10', '12.ABC.345/01DE-35', '12abc34501de35'])('CNPJ válido %s', valor => expect(validarCnpj(valor)).toBe(true))
it.each(['', '00000000000000', '12ABC34501DE36', '12@ABC34501DE35', null])('CNPJ inválido %s', valor => expect(validarCnpj(valor)).toBe(false))
it('preserva letras e zeros', () => { expect(normalizarCnpj('04.252.011/0001-10')).toBe('04252011000110'); expect(normalizarCnpj('12.abc.345/01de-35')).toBe('12ABC34501DE35') })
it('preserva contrato legado nomeCliente', () => { expect(nomeCliente({ nome: ' Ana ' })).toBe('Ana'); expect(nomeCliente({ nome: null })).toBe('Sem nome') })
