import { DéclarationDeGardeAMA, DéclarationDeGardeGED } from "./éligibilité"

export class DéclarationsDeGardeAMAFactory<Prénom extends string = string> {
	private enfantsGardés
	private heuresDeGarde = 100

	constructor(prénoms: Prénom[]) {
    this.enfantsGardés = prénoms
	}
    
	avecNbHeures(nbHeures: number) {
		this.heuresDeGarde = nbHeures

		return this
	}

	build() {
		return {
			type: 'AMA',
			heuresDeGarde: this.heuresDeGarde,
			enfantsGardés: this.enfantsGardés,
		} as const satisfies DéclarationDeGardeAMA<Prénom>
	}
}

export class DéclarationsDeGardeGEDFactory {
	private heuresDeGarde = 50

	avecNombreHeures(nbHeures: number) {
			this.heuresDeGarde = nbHeures

			return this
	}

	build() {
		return {
			type: 'GED',
			heuresDeGarde: this.heuresDeGarde
		} as const satisfies DéclarationDeGardeGED
	}
}
