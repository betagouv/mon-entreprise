import { euros, Montant } from "@/domaine/Montant"
import { DéclarationDeGarde, MoisHistorique } from "./éligibilité"
import * as O from 'effect/Option'
import * as A from 'effect/Array'
import { DéclarationsDeGardeAMAFactory, DéclarationsDeGardeGEDFactory } from "./déclarationDeGardeFactory"

export class MoisHistoriqueFactory<Prénom extends string = string> {
	private droitsOuverts = true
	private ressources = O.some(euros(2_000))
	private déclarationsDeGarde = [] as DéclarationDeGarde[]

	sansDroitsOuverts() { 
		this.droitsOuverts = false
		
		return this
	}

	sansRessources() {
		this.ressources = O.none()

		return this
	}

    avecRessources(montant: Montant<"Euro">) {
        this.ressources = O.some(montant)

        return this
    }

	avecAMA(prénoms: Prénom[], nbHeures: number = 100) {
		this.déclarationsDeGarde = [
			...this.déclarationsDeGarde,
			(new DéclarationsDeGardeAMAFactory(prénoms)).avecNbHeures(nbHeures).build(),
		]

		return this
	}

	avecGED(nbHeures: number = 50) {
		this.déclarationsDeGarde = [
			...this.déclarationsDeGarde,
			(new DéclarationsDeGardeGEDFactory()).avecNombreHeures(nbHeures).build(),
		]
			
		return this
	}

	sansGED() { 
		this.déclarationsDeGarde = A.filter(this.déclarationsDeGarde, d => d.type !== "GED")

		return this
	}

	build () {	
		return {
			droitsOuverts: this.droitsOuverts,
			ressources: this.ressources,
			déclarationsDeGarde: this.déclarationsDeGarde
		} as const satisfies MoisHistorique
	}
}
