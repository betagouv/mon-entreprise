import * as O from 'effect/Option'

import * as M from '@/domaine/Montant'
import * as MP from '@/domaine/MontantPonctuel'

import {
	DéclarationDeGardeAMA,
	DéclarationDeGardeGED,
} from './déclaration-de-garde'

export class DéclarationsDeGardeAMAFactory<Prénom extends string = string> {
	private enfantsGardés
	private heuresDeGarde = O.some(100)
	private rémunération = O.some(MP.euros(500))
	private CMGPerçu = O.some(MP.euros(200))

	constructor(prénoms: Prénom[]) {
		this.enfantsGardés = prénoms
	}

	avecNbHeures(nbHeures: number) {
		this.heuresDeGarde = O.some(nbHeures)

		return this
	}

	avecRémunération(rémunération: M.Montant<'€'>) {
		this.rémunération = O.some(rémunération)

		return this
	}

	avecCMG(CMG: M.Montant<'€'>) {
		this.CMGPerçu = O.some(CMG)

		return this
	}

	sansCMG() {
		this.CMGPerçu = O.none()

		return this
	}

	build() {
		return {
			type: 'AMA',
			heuresDeGarde: this.heuresDeGarde,
			enfantsGardés: this.enfantsGardés,
			rémunération: this.rémunération,
			CMGPerçu: this.CMGPerçu,
		} as const satisfies DéclarationDeGardeAMA<Prénom>
	}
}

export class DéclarationsDeGardeGEDFactory {
	private heuresDeGarde = O.some(50)
	private rémunération = O.some(MP.euros(500))
	private CMGPerçu = O.some(MP.euros(200))

	avecNbHeures(nbHeures: number) {
		this.heuresDeGarde = O.some(nbHeures)

		return this
	}

	avecRémunération(rémunération: M.Montant<'€'>) {
		this.rémunération = O.some(rémunération)

		return this
	}

	avecCMG(CMG: M.Montant<'€'>) {
		this.CMGPerçu = O.some(CMG)

		return this
	}

	sansCMG() {
		this.CMGPerçu = O.none()

		return this
	}

	build() {
		return {
			type: 'GED',
			heuresDeGarde: this.heuresDeGarde,
			rémunération: this.rémunération,
			CMGPerçu: this.CMGPerçu,
		} as const satisfies DéclarationDeGardeGED
	}
}
