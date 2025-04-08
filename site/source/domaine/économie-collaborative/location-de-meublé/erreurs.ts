import { Data } from 'effect'

import { RegimeCotisation } from '@/domaine/économie-collaborative/location-de-meublé/situation'
import { EuroParAn } from '@/domaine/Montant'

export type RégimeInapplicable =
	| RecettesInférieuresAuSeuilRequisPourCeRégime
	| RecettesSupérieuresAuPlafondAutoriséPourCeRégime

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
	recettes: EuroParAn
	plafond: EuroParAn
	régime: RegimeCotisation
}> {
	toString(): string {
		return `Recettes (${this.recettes.valeur} €) supérieures au plafond autorisé (${this.plafond.valeur} €) - ce niveau de recettes n'est pas autorisé pour le régime "${this.régime}"`
	}
}

export class RecettesInférieuresAuSeuilRequisPourCeRégime extends Data.TaggedError(
	'RecettesInférieuresAuSeuilRequisPourCeRégime'
)<{
	recettes: EuroParAn
	seuil: EuroParAn
	régime: RegimeCotisation
}> {
	toString(): string {
		return `Recettes (${this.recettes.valeur} €) inférieures au seuil de professionnalisation (${this.seuil.valeur} €) - ce niveau de recettes n'est pas autorisé pour le régime "${this.régime}"`
	}
}
