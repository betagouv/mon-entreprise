import { pipe } from 'effect'
import * as O from 'effect/Option'

import { montantToNumber } from '@/domaine/Montant'
import { eurosParAn, toEurosParAn } from '@/domaine/MontantRecurrent'
import { pourcentage, quantité } from '@/domaine/Quantite'
import {
	encodeSituationSérialisée,
	parseSituationSérialisée,
} from '@/utils/URLs'

import { NaturesActivité, TypesActivité } from './activite'
import {
	Impositions,
	MéthodesImposition,
	SituationsFamiliales,
} from './imposition'
import {
	champModifié,
	initialSituationComparée,
	SituationComparée,
} from './situation'

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

const sérialiseurs = {
	chiffreDAffaires: (situation) =>
		pipe(
			situation.chiffreDAffaires,
			O.map(toEurosParAn),
			O.map(montantToNumber),
			O.getOrUndefined
		),

	charges: (situation) =>
		pipe(
			situation.charges,
			O.map(toEurosParAn),
			O.map(montantToNumber),
			O.getOrUndefined
		),

	IRouIS: (situation) => situation.IRouIS,

	versementLibératoire: (situation) => situation.versementLibératoire,

	natureActivité: (situation) => situation.natureActivité,

	typeActivité: (situation) => situation.typeActivité,

	activitéLibéraleRéglementée: (situation) =>
		situation.activitéLibéraleRéglementée,

	acre: (situation) => situation.acre,

	tva: (situation) => situation.tva,

	méthodeImposition: (situation) => situation.méthodeImposition,

	tauxImposition: (situation) =>
		pipe(
			situation.tauxImposition,
			O.map((quantité) => quantité.valeur),
			O.getOrUndefined
		),

	situationFamiliale: (situation) => situation.situationFamiliale,

	enfants: (situation) => situation.enfants.valeur,

	parentIsolé: (situation) => situation.parentIsolé,

	autresRevenus: (situation) => situation.autresRevenus.valeur,
} satisfies {
	[K in ChampSituationSérialisable]: (
		situation: SituationComparée
	) => SituationSérialisée[K]
}
// Ce typage permet de s'assurer que tous les champs de SituationComparée sont bien
// encodés dans l'URL, y compris les nouveaux champs ajoutés dans le futur. Si un
// champ n'est pas encodé, TypeScript renverra une erreur de typage.
type ChampSituationSérialisable = Exclude<
	keyof SituationComparée,
	'_tag' | '_type'
>

export const encodeSituation = (situation: SituationComparée): string => {
	const sérialisée = Object.fromEntries(
		(Object.keys(sérialiseurs) as ChampSituationSérialisable[])
			.filter((champ) => champModifié(situation, champ))
			.map((champ) => [champ, sérialiseurs[champ](situation)])
	) as SituationSérialisée

	return encodeSituationSérialisée(sérialisée)
}

export const decodeSituation = (chaîne: string): SituationComparée => {
	const sérialisée = parseSituationSérialisée<SituationSérialisée>(chaîne)

	const parsedCA = parseNombre(sérialisée.chiffreDAffaires)
	const parsedCharges = parseNombre(sérialisée.charges)
	const parsedTauxImposition = parseNombre(sérialisée.tauxImposition)
	const parsedEnfants = parseNombre(sérialisée.enfants)
	const parsedAutresRevenus = parseNombre(sérialisée.autresRevenus)

	return {
		...initialSituationComparée,
		...(parsedCA !== undefined
			? { chiffreDAffaires: O.some(eurosParAn(parsedCA)) }
			: {}),
		...(parsedCharges !== undefined
			? { charges: O.some(eurosParAn(parsedCharges)) }
			: {}),
		IRouIS: parseOption(
			Impositions,
			sérialisée.IRouIS,
			initialSituationComparée.IRouIS
		),
		versementLibératoire: parseBooléen(
			sérialisée.versementLibératoire,
			initialSituationComparée.versementLibératoire
		),
		natureActivité: parseOption(
			NaturesActivité,
			sérialisée.natureActivité,
			initialSituationComparée.natureActivité
		),
		typeActivité: parseOption(
			TypesActivité,
			sérialisée.typeActivité,
			initialSituationComparée.typeActivité
		),
		activitéLibéraleRéglementée: parseBooléen(
			sérialisée.activitéLibéraleRéglementée,
			initialSituationComparée.activitéLibéraleRéglementée
		),
		acre: parseBooléen(sérialisée.acre, initialSituationComparée.acre),
		tva: parseBooléen(sérialisée.tva, initialSituationComparée.tva),
		méthodeImposition: parseOption(
			MéthodesImposition,
			sérialisée.méthodeImposition,
			initialSituationComparée.méthodeImposition
		),
		...(parsedTauxImposition !== undefined
			? { tauxImposition: O.some(pourcentage(parsedTauxImposition)) }
			: {}),
		situationFamiliale: parseOption(
			SituationsFamiliales,
			sérialisée.situationFamiliale,
			initialSituationComparée.situationFamiliale
		),
		...(parsedEnfants !== undefined
			? { enfants: quantité(parsedEnfants, 'enfant') }
			: {}),
		parentIsolé: parseBooléen(
			sérialisée.parentIsolé,
			initialSituationComparée.parentIsolé
		),
		...(parsedAutresRevenus !== undefined
			? { autresRevenus: eurosParAn(parsedAutresRevenus) }
			: {}),
	}
}

const parseNombre = (valeur: unknown): number | undefined =>
	typeof valeur === 'number' && Number.isFinite(valeur) && valeur >= 0
		? valeur
		: undefined

const parseBooléen = (valeur: unknown, défaut: boolean): boolean =>
	typeof valeur === 'boolean' ? valeur : défaut

const parseOption = <T extends string>(
	possibilités: readonly T[],
	valeur: unknown,
	défaut: T
): T => (possibilités.includes(valeur as T) ? (valeur as T) : défaut)
