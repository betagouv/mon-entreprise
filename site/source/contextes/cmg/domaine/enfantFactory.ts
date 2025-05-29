import { Enfant } from './enfant'

export class EnfantFactory {
	private dateDeNaissance = new Date('2023-01-01')

	moinsDe3Ans() {
		this.dateDeNaissance = new Date('2023-02-18')

		return this
	}

	plusDe3Ans() {
		this.dateDeNaissance = new Date('2020-07-31')

		return this
	}

	néEn(année: number) {
		this.dateDeNaissance = new Date(`${année}-12-31`)

		return this
	}

	plusDe6Ans() {
		this.dateDeNaissance = new Date('2019-08-31')

		return this
	}

	build() {
		return {
			dateDeNaissance: this.dateDeNaissance,
		} as const satisfies Enfant
	}
}
