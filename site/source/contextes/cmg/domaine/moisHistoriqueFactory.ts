import * as A from 'effect/Array'

import * as M from '@/domaine/Montant'

import { DéclarationDeGarde } from './déclaration-de-garde'
import {
	DéclarationsDeGardeAMAFactory,
	DéclarationsDeGardeGEDFactory,
} from './déclarationDeGardeFactory'
import { MoisHistorique } from './situation'

type Options = {
	nbHeures?: number
	CMG?: M.Montant<'Euro'> | false
	rémunération?: M.Montant<'Euro'>
}

export class MoisHistoriqueFactory<Prénom extends string = string> {
	private déclarationsDeGarde = [] as DéclarationDeGarde[]

	avecAMA(
		prénoms: Prénom[],
		{ nbHeures = 100, CMG, rémunération }: Options = {}
	) {
		let déclarationDeGarde = new DéclarationsDeGardeAMAFactory(prénoms)
		if (nbHeures) {
			déclarationDeGarde = déclarationDeGarde.avecNbHeures(nbHeures)
		}
		if (CMG === false) {
			déclarationDeGarde = déclarationDeGarde.sansCMG()
		} else if (CMG) {
			déclarationDeGarde = déclarationDeGarde.avecCMG(CMG)
		}
		if (rémunération) {
			déclarationDeGarde = déclarationDeGarde.avecRémunération(rémunération)
		}

		this.déclarationsDeGarde = [
			...this.déclarationsDeGarde,
			déclarationDeGarde.build(),
		]

		return this
	}

	avecGED({ nbHeures = 50, CMG, rémunération }: Options = {}) {
		let déclarationDeGarde = new DéclarationsDeGardeGEDFactory()
		if (nbHeures) {
			déclarationDeGarde = déclarationDeGarde.avecNbHeures(nbHeures)
		}
		if (CMG === false) {
			déclarationDeGarde = déclarationDeGarde.sansCMG()
		} else if (CMG) {
			déclarationDeGarde = déclarationDeGarde.avecCMG(CMG)
		}
		if (rémunération) {
			déclarationDeGarde = déclarationDeGarde.avecRémunération(rémunération)
		}

		this.déclarationsDeGarde = [
			...this.déclarationsDeGarde,
			déclarationDeGarde.build(),
		]

		return this
	}

	sansGED() {
		this.déclarationsDeGarde = A.filter(
			this.déclarationsDeGarde,
			(d) => d.type !== 'GED'
		)

		return this
	}

	build() {
		return {
			déclarationsDeGarde: this.déclarationsDeGarde,
		} as const satisfies MoisHistorique
	}
}
