import { Brand } from 'effect'

export type Montant = number & Brand.Brand<'Montant'>

export const Montant = Brand.nominal<Montant>()

declare const montant: Montant

const toto = (montant * 2) as Montant
