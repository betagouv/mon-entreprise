import { Brand } from 'effect'

import { SituationSalarié } from './situation'

export interface SalaireBrut {
	_tag: 'salaire_brut'
	brut: EurosParMois
}

export interface SalaireNet {
	_tag: 'salaire_net'
	net: EurosParMois
}

export type Salaire = SalaireBrut | SalaireNet

export const getSalaireBrut = (situation: SituationSalarié): SalaireBrut =>
	situation.salaireBrut

export type EurosParMois = number & Brand.Brand<'EurosParMois'>
export const EurosParMois = Brand.nominal<EurosParMois>()
