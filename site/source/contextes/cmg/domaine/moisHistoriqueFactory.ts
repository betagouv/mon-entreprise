import * as A from 'effect/Array'
import * as O from 'effect/Option'

import * as M from '@/domaine/Montant'

import { DéclarationDeGarde } from './déclaration-de-garde'
import {
	DéclarationsDeGardeAMAFactory,
	DéclarationsDeGardeGEDFactory,
} from './déclarationDeGardeFactory'
import { MoisHistorique } from './situationCMG'

type Options = {
	nbHeures?: number
	CMG?: M.Montant<'Euro'> | false
}

export class MoisHistoriqueFactory<Prénom extends string = string> {
	private ressources = O.some(M.euros(2_000))
	private déclarationsDeGarde = [] as DéclarationDeGarde[]

	sansRessources() {
		this.ressources = O.none()

		return this
	}

	avecRessources(montant: M.Montant<'Euro'>) {
		this.ressources = O.some(montant)

		return this
	}

	avecAMA(prénoms: Prénom[], { nbHeures = 100, CMG }: Options = {}) {
		let déclarationDeGarde = new DéclarationsDeGardeAMAFactory(prénoms)
		if (nbHeures) {
			déclarationDeGarde = déclarationDeGarde.avecNbHeures(nbHeures)
		}
		if (CMG === false) {
			déclarationDeGarde = déclarationDeGarde.sansCMG()
		} else if (CMG) {
			déclarationDeGarde = déclarationDeGarde.avecCMG(CMG)
		}

		this.déclarationsDeGarde = [
			...this.déclarationsDeGarde,
			déclarationDeGarde.build(),
		]

		return this
	}

	avecGED({ nbHeures = 50, CMG }: Options = {}) {
		let déclarationDeGarde = new DéclarationsDeGardeGEDFactory()
		if (nbHeures) {
			déclarationDeGarde = déclarationDeGarde.avecNbHeures(nbHeures)
		}
		if (CMG === false) {
			déclarationDeGarde = déclarationDeGarde.sansCMG()
		} else if (CMG) {
			déclarationDeGarde = déclarationDeGarde.avecCMG(CMG)
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
			ressources: this.ressources,
			déclarationsDeGarde: this.déclarationsDeGarde,
		} as const satisfies MoisHistorique
	}
}
