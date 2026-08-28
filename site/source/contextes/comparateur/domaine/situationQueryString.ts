import { Option, pipe } from 'effect'
import * as O from 'effect/Option'

import { montantToNumber } from '@/domaine/Montant'
import { eurosParAn } from '@/domaine/MontantRecurrent'
import { pourcentage, quantité } from '@/domaine/Quantite'
import { fromBase64Url, toBase64Url } from '@/utils/URLs'

import { NatureActivité, TypeActivité } from './activite'
import { IRouIS, MéthodeImposition, SituationFamiliale } from './imposition'
import { initialSituationComparée, SituationComparée } from './situation'

type SituationSérialisée = {
	chiffreDAffaires?: number
	charges?: number
	IRouIS?: string
	versementLibératoire?: boolean
	natureActivité?: string
	typeActivité?: string
	activitéLibéraleRéglementée?: boolean
	acre?: boolean
	tva?: boolean
	méthodeImposition?: string
	tauxImposition?: number
	situationFamiliale?: string
	enfants?: number
	parentIsolé?: boolean
	autresRevenus?: number
}

export const encodeSituation = (situation: SituationComparée): string => {
	const sérialisée: SituationSérialisée = {
		chiffreDAffaires: pipe(
			situation.chiffreDAffaires,
			O.map(montantToNumber),
			O.getOrUndefined
		),
		charges: pipe(situation.charges, O.map(montantToNumber), O.getOrUndefined),
		IRouIS: situation.IRouIS,
		versementLibératoire: situation.versementLibératoire,
		natureActivité: situation.natureActivité,
		typeActivité: situation.typeActivité,
		activitéLibéraleRéglementée: situation.activitéLibéraleRéglementée,
		acre: situation.acre,
		tva: situation.tva,
		méthodeImposition: situation.méthodeImposition,
		tauxImposition: pipe(
			situation.tauxImposition,
			O.map((quantité) => quantité.valeur),
			O.getOrUndefined
		),
		situationFamiliale: situation.situationFamiliale,
		enfants: situation.enfants.valeur,
		parentIsolé: situation.parentIsolé,
		autresRevenus: situation.autresRevenus.valeur,
	}

	return toBase64Url(JSON.stringify(sérialisée))
}

export const decodeSituation = (chaîne: string): SituationComparée => {
	const sérialisée = parseSituationSérialisée(chaîne)

	const parsedCA = parseNombre(sérialisée.chiffreDAffaires)
	const parsedCharges = parseNombre(sérialisée.charges)
	const parsedTauxImposition = parseNombre(sérialisée.tauxImposition)
	const parsedEnfants = parseNombre(sérialisée.enfants)
	const parsedAutresRevenus = parseNombre(sérialisée.autresRevenus)

	return {
		...initialSituationComparée,
		chiffreDAffaires: parsedCA
			? Option.some(eurosParAn(parsedCA))
			: initialSituationComparée.chiffreDAffaires,
		charges: parsedCharges
			? Option.some(eurosParAn(parsedCharges))
			: initialSituationComparée.charges,
		IRouIS: (sérialisée.IRouIS as IRouIS) ?? initialSituationComparée.IRouIS,
		versementLibératoire:
			sérialisée.versementLibératoire ??
			initialSituationComparée.versementLibératoire,
		natureActivité:
			(sérialisée.natureActivité as NatureActivité) ??
			initialSituationComparée.natureActivité,
		typeActivité:
			(sérialisée.typeActivité as TypeActivité) ??
			initialSituationComparée.typeActivité,
		activitéLibéraleRéglementée:
			sérialisée.activitéLibéraleRéglementée ??
			initialSituationComparée.activitéLibéraleRéglementée,
		acre: sérialisée.acre ?? initialSituationComparée.acre,
		tva: sérialisée.tva ?? initialSituationComparée.tva,
		méthodeImposition:
			(sérialisée.méthodeImposition as MéthodeImposition) ??
			initialSituationComparée.méthodeImposition,
		tauxImposition: parsedTauxImposition
			? O.some(pourcentage(parsedTauxImposition))
			: O.none(),
		situationFamiliale:
			(sérialisée.situationFamiliale as SituationFamiliale) ??
			initialSituationComparée.situationFamiliale,
		enfants: parsedEnfants
			? quantité(parsedEnfants, 'enfant')
			: initialSituationComparée.enfants,
		parentIsolé: sérialisée.parentIsolé ?? initialSituationComparée.parentIsolé,
		autresRevenus: parsedAutresRevenus
			? eurosParAn(parsedAutresRevenus)
			: initialSituationComparée.autresRevenus,
	}
}

const parseSituationSérialisée = (chaîne: string): SituationSérialisée => {
	try {
		const parsed: unknown = JSON.parse(fromBase64Url(chaîne))

		return typeof parsed === 'object' && parsed !== null
			? (parsed as SituationSérialisée)
			: {}
	} catch {
		return {}
	}
}

const parseNombre = (valeur: unknown): number | undefined =>
	typeof valeur === 'number' && Number.isFinite(valeur) && valeur >= 0
		? valeur
		: undefined
