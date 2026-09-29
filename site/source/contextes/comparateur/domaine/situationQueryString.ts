import { pipe } from 'effect'
import * as O from 'effect/Option'

import { montantToNumber } from '@/domaine/Montant'
import { eurosParAn, toEurosParAn } from '@/domaine/MontantRecurrent'
import { pourcentage, quantité } from '@/domaine/Quantite'
import { parseSituationSérialisée, toBase64Url } from '@/utils/URLs'

import { NaturesActivité, TypesActivité } from './activite'
import {
	Impositions,
	MéthodesImposition,
	SituationsFamiliales,
} from './imposition'
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
	const sérialiseChamp = <
		C extends keyof SituationSérialisée & keyof SituationComparée,
	>(
		clé: C,
		valeur: SituationSérialisée[C]
	): Partial<SituationSérialisée> =>
		situation[clé] === initialSituationComparée[clé] ? {} : { [clé]: valeur }

	const sérialisée: SituationSérialisée = {
		...sérialiseChamp(
			'chiffreDAffaires',
			pipe(
				situation.chiffreDAffaires,
				O.map(toEurosParAn),
				O.map(montantToNumber),
				O.getOrUndefined
			)
		),
		...sérialiseChamp(
			'charges',
			pipe(
				situation.charges,
				O.map(toEurosParAn),
				O.map(montantToNumber),
				O.getOrUndefined
			)
		),
		...sérialiseChamp('IRouIS', situation.IRouIS),
		...sérialiseChamp('versementLibératoire', situation.versementLibératoire),
		...sérialiseChamp('natureActivité', situation.natureActivité),
		...sérialiseChamp('typeActivité', situation.typeActivité),
		...sérialiseChamp(
			'activitéLibéraleRéglementée',
			situation.activitéLibéraleRéglementée
		),
		...sérialiseChamp('acre', situation.acre),
		...sérialiseChamp('tva', situation.tva),
		...sérialiseChamp('méthodeImposition', situation.méthodeImposition),
		...sérialiseChamp(
			'tauxImposition',
			pipe(
				situation.tauxImposition,
				O.map((quantité) => quantité.valeur),
				O.getOrUndefined
			)
		),
		...sérialiseChamp('situationFamiliale', situation.situationFamiliale),
		...sérialiseChamp('enfants', situation.enfants.valeur),
		...sérialiseChamp('parentIsolé', situation.parentIsolé),
		...sérialiseChamp('autresRevenus', situation.autresRevenus.valeur),
	}

	return toBase64Url(JSON.stringify(sérialisée))
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
