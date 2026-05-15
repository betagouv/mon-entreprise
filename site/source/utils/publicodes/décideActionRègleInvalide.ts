import { RÈGLES_IDENTITÉ_ENTREPRISE } from '@/domaine/Entreprise'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { SituationPublicodes } from '@/store/reducers/rootReducer'

export type ContexteRègleInvalide = {
	situationDuSimulateur: SituationPublicodes
	situationDeLEntreprise: SituationPublicodes
	situationDeConfiguration: SituationPublicodes
}

export type ActionRègleInvalide =
	| { kind: 'réinitialiser-entreprise'; règle: DottedName }
	| { kind: 'omettre-et-marquer-obsolète'; règle: DottedName }
	| { kind: 'omettre'; règle: DottedName }
	| { kind: 'erreur-inconnue'; règle: DottedName }

const estRègleIdentitéEntreprise = (règle: DottedName): boolean =>
	(RÈGLES_IDENTITÉ_ENTREPRISE as ReadonlyArray<DottedName>).includes(règle)

export function décideActionRègleInvalide(
	règleInvalide: DottedName,
	{
		situationDuSimulateur,
		situationDeLEntreprise,
		situationDeConfiguration,
	}: ContexteRègleInvalide
): ActionRègleInvalide {
	if (estRègleIdentitéEntreprise(règleInvalide)) {
		return { kind: 'réinitialiser-entreprise', règle: règleInvalide }
	}

	if (règleInvalide in situationDuSimulateur) {
		return { kind: 'omettre-et-marquer-obsolète', règle: règleInvalide }
	}

	if (
		règleInvalide in situationDeLEntreprise ||
		règleInvalide in situationDeConfiguration
	) {
		return { kind: 'omettre', règle: règleInvalide }
	}

	return { kind: 'erreur-inconnue', règle: règleInvalide }
}
