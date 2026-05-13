import { DottedName } from '@/domaine/publicodes/DottedName'
import { SituationPublicodes } from '@/store/reducers/rootReducer'

export type ContexteRègleInvalide = {
	situationDuSimulateur: SituationPublicodes
	situationDeLEntreprise: SituationPublicodes
	situationDeConfiguration: SituationPublicodes
}

export type ActionRègleInvalide =
	| { kind: 'omettre-et-marquer-obsolète'; règle: DottedName }
	| { kind: 'omettre'; règle: DottedName }
	| { kind: 'erreur-inconnue'; règle: DottedName }

export function décideActionRègleInvalide(
	règleInvalide: DottedName,
	{
		situationDuSimulateur,
		situationDeLEntreprise,
		situationDeConfiguration,
	}: ContexteRègleInvalide
): ActionRègleInvalide {
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
