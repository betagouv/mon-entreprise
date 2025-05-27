import * as O from 'effect/Option'

import * as M from '@/domaine/Montant'

import { DéclarationDeGardeAMA, DéclarationDeGardeGED } from './éligibilité'

export class DéclarationsDeGardeAMAFactory<Prénom extends string = string> {
	private enfantsGardés
	private heuresDeGarde = 100
	private rémunération = M.euros(500)
	private CMGPerçu = O.some(M.euros(200))

	constructor(prénoms: Prénom[]) {
		this.enfantsGardés = prénoms
	}

	avecNbHeures(nbHeures: number) {
		this.heuresDeGarde = nbHeures

		return this
	}

	avecRémunération(rémunération: M.Montant<'Euro'>) {
		this.rémunération = rémunération

		return this
	}

	avecCMG(CMG: M.Montant<'Euro'>) {
		this.CMGPerçu = O.some(CMG)

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
	private heuresDeGarde = 50
	private rémunération = M.euros(500)
	private CMGPerçu = O.some(M.euros(200))

	avecNbHeures(nbHeures: number) {
		this.heuresDeGarde = nbHeures

		return this
	}

	avecRémunération(rémunération: M.Montant<'Euro'>) {
		this.rémunération = rémunération

		return this
	}

	avecCMG(CMG: M.Montant<'Euro'>) {
		this.CMGPerçu = O.some(CMG)

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
