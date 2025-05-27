import { DéclarationDeGardeAMA, DéclarationDeGardeGED } from './éligibilité'

export class DéclarationsDeGardeAMAFactory<Prénom extends string = string> {
	private enfantsGardés
	private heuresDeGarde = 100
	private rémunération = 500

	constructor(prénoms: Prénom[]) {
		this.enfantsGardés = prénoms
	}

	avecNbHeures(nbHeures: number) {
		this.heuresDeGarde = nbHeures

		return this
	}

	avecRémunération(rémunération: number) {
		this.rémunération = rémunération

		return this
	}

	build() {
		return {
			type: 'AMA',
			heuresDeGarde: this.heuresDeGarde,
			enfantsGardés: this.enfantsGardés,
			rémunération: this.rémunération,
		} as const satisfies DéclarationDeGardeAMA<Prénom>
	}
}

export class DéclarationsDeGardeGEDFactory {
	private heuresDeGarde = 50
	private rémunération = 500

	avecNbHeures(nbHeures: number) {
		this.heuresDeGarde = nbHeures

		return this
	}

	avecRémunération(rémunération: number) {
		this.rémunération = rémunération

		return this
	}

	build() {
		return {
			type: 'GED',
			heuresDeGarde: this.heuresDeGarde,
			rémunération: this.rémunération,
		} as const satisfies DéclarationDeGardeGED
	}
}
