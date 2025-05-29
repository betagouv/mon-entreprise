import * as O from 'effect/Option'

import { Enfant } from './enfant'

export class EnfantFactory {
	private prénom
	private dateDeNaissance = O.some(new Date('2023-01-01'))

	constructor(prénom: string) {
		this.prénom = O.some(prénom)
	}

	moinsDe3Ans() {
		this.dateDeNaissance = O.some(new Date('2023-02-18'))

		return this
	}

	plusDe3Ans() {
		this.dateDeNaissance = O.some(new Date('2020-07-31'))

		return this
	}

	néEn(année: number) {
		this.dateDeNaissance = O.some(new Date(`${année}-12-31`))

		return this
	}

	plusDe6Ans() {
		this.dateDeNaissance = O.some(new Date('2019-08-31'))

		return this
	}

	build() {
		return {
			prénom: this.prénom,
			dateDeNaissance: this.dateDeNaissance,
		} as const satisfies Enfant
	}
}
