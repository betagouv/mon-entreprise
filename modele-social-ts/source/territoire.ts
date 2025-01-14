import { Brand } from 'effect'

export type CodePostal = `${number}${number}${number}${number}${number}` &
	Brand.Brand<'CodePostal'>

export type Commune = CodePostal
