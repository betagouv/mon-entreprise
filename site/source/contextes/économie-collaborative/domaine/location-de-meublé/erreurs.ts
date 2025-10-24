import { Data } from 'effect'

import { Montant } from '@/domaine/Montant'

import { RegimeCotisation, TypeLocation } from './situation'

export type RégimeInapplicable =
	| RecettesInférieuresAuSeuilRequisPourCeRégime
	| RecettesSupérieuresAuPlafondAutoriséPourCeRégime
	| RégimeNonApplicablePourCeTypeDeLocation
	| AffiliationObligatoire

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
		return `Recettes (${this.recettes.valeur} €) supérieures au plafond autorisé (${this.plafond.valeur} €) - ce niveau de recettes n'est pas autorisé pour le régime "${this.régime}"`
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
		return `Recettes (${this.recettes.valeur} €) inférieures au seuil de professionnalisation (${this.seuil.valeur} €) - ce niveau de recettes n'est pas autorisé pour le régime "${this.régime}"`
	}
}

export class RégimeNonApplicablePourCeTypeDeLocation extends Data.TaggedError(
	'RégimeNonApplicablePourCeTypeDeLocation'
)<{
	typeLocation: TypeLocation
	régime: RegimeCotisation
}> {
	toString(): string {
		return `Le régime "${this.régime}" n'est pas applicable pour le type de location "${this.typeLocation}"`
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

export const RaisonInapplicabilité = {
	estTypeDeLocationIncompatible: (
		erreur: RégimeInapplicable
	): erreur is RégimeNonApplicablePourCeTypeDeLocation => {
		return erreur._tag === 'RégimeNonApplicablePourCeTypeDeLocation'
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
} as const
