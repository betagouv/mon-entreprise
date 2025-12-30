import { Data } from 'effect'

import { Montant } from '@/domaine/Montant'

import { RegimeCotisation, TypeDurée } from './situation'

export type RégimeInapplicable =
	| RecettesInférieuresAuSeuilRequisPourCeRégime
	| RecettesSupérieuresAuPlafondAutoriséPourCeRégime
	| RégimeNonApplicablePourCeTypeDeDurée
	| RégimeNonApplicablePourChambreDHôte
	| AffiliationObligatoire
	| AffiliationNonObligatoire

export class SituationIncomplète extends Data.TaggedError(
	'SituationIncomplète'
)<{
	message: string
}> {
	toString(): string {
		return this.message
	}
}

export type SimulationImpossible = RégimeInapplicable | SituationIncomplète

export class RecettesSupérieuresAuPlafondAutoriséPourCeRégime extends Data.TaggedError(
	'RecettesSupérieuresAuPlafondAutoriséPourCeRégime'
)<{
	recettes: Montant<'€/an'>
	plafond: Montant<'€/an'>
	régime: RegimeCotisation
}> {
	toString(): string {
		return `Recettes (${this.recettes.valeur} €) supérieures au plafond autorisé (${this.plafond.valeur} €). Ce niveau de recettes n'est pas autorisé pour le régime "${this.régime}"`
	}
}

export class RecettesInférieuresAuSeuilRequisPourCeRégime extends Data.TaggedError(
	'RecettesInférieuresAuSeuilRequisPourCeRégime'
)<{
	recettes: Montant<'€/an'>
	seuil: Montant<'€/an'>
	régime: RegimeCotisation
}> {
	toString(): string {
		return `Recettes (${this.recettes.valeur} €) inférieures au seuil de professionnalisation (${this.seuil.valeur} €). Ce niveau de recettes n'est pas autorisé pour le régime "${this.régime}"`
	}
}

export class RégimeNonApplicablePourCeTypeDeDurée extends Data.TaggedError(
	'RégimeNonApplicablePourCeTypeDeDurée'
)<{
	typeDurée: TypeDurée
	régime: RegimeCotisation
	estActivitéPrincipale: boolean
}> {
	toString(): string {
		return `Le régime "${
			this.régime
		}" n'est pas applicable pour le type de durée "${
			this.typeDurée
		}" (activité ${this.estActivitéPrincipale ? 'principale' : 'secondaire'})`
	}
}

export class RégimeNonApplicablePourChambreDHôte extends Data.TaggedError(
	'RégimeNonApplicablePourChambreDHôte'
)<{
	régime: RegimeCotisation
}> {
	toString(): string {
		return `Le régime "${this.régime}" n'est pas applicable pour les chambres d'hôtes`
	}
}

export class AffiliationObligatoire extends Data.TaggedError(
	'AffiliationObligatoire'
)<{
	recettes: Montant<'€/an'>
	seuil: Montant<'€/an'>
}> {
	toString(): string {
		return `L'affiliation est obligatoire au-dessus de ${this.seuil.valeur} € de recettes (recettes : ${this.recettes.valeur} €)`
	}
}

export class AffiliationNonObligatoire extends Data.TaggedError(
	'AffiliationNonObligatoire'
) {
	toString(): string {
		return `L'affiliation n'est pas obligatoire`
	}
}

export const RaisonInapplicabilité = {
	estTypeDeDuréeIncompatible: (
		erreur: RégimeInapplicable
	): erreur is RégimeNonApplicablePourCeTypeDeDurée => {
		return erreur._tag === 'RégimeNonApplicablePourCeTypeDeDurée'
	},

	estChambreDHôte: (
		erreur: RégimeInapplicable
	): erreur is RégimeNonApplicablePourChambreDHôte => {
		return erreur._tag === 'RégimeNonApplicablePourChambreDHôte'
	},

	estRecettesTropÉlevées: (
		erreur: RégimeInapplicable
	): erreur is RecettesSupérieuresAuPlafondAutoriséPourCeRégime => {
		return erreur._tag === 'RecettesSupérieuresAuPlafondAutoriséPourCeRégime'
	},

	estRecettesTropFaibles: (
		erreur: RégimeInapplicable
	): erreur is RecettesInférieuresAuSeuilRequisPourCeRégime => {
		return erreur._tag === 'RecettesInférieuresAuSeuilRequisPourCeRégime'
	},

	estAffiliationObligatoire: (
		erreur: RégimeInapplicable
	): erreur is AffiliationObligatoire => {
		return erreur._tag === 'AffiliationObligatoire'
	},

	estAffiliationNonObligatoire: (
		erreur: RégimeInapplicable
	): erreur is AffiliationNonObligatoire => {
		return erreur._tag === 'AffiliationNonObligatoire'
	},
} as const
