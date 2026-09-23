import Engine from 'publicodes'

import { DottedName } from '@/domaine/publicodes/DottedName'

import { lodeomDottedName, rémunérationBruteDottedName } from './publicodes'

export type Répartition = {
	IRC: number
	Urssaf: number
	chômage: number
}

export const emptyRépartition: Répartition = {
	IRC: 0,
	Urssaf: 0,
	chômage: 0,
}

export const getRépartition = (
	rémunération: number,
	réduction: number,
	engine: Engine<DottedName>
): Répartition => {
	const contexte = {
		[rémunérationBruteDottedName]: rémunération,
		[lodeomDottedName]: réduction,
	}
	const IRC =
		(engine.evaluate({
			valeur: `${lodeomDottedName} . imputation retraite complémentaire`,
			unité: '€/mois',
			contexte,
		})?.nodeValue as number) ?? 0
	const Urssaf =
		(engine.evaluate({
			valeur: `${lodeomDottedName} . imputation sécurité sociale`,
			unité: '€/mois',
			contexte,
		})?.nodeValue as number) ?? 0
	const chômage =
		(engine.evaluate({
			valeur: `${lodeomDottedName} . imputation chômage`,
			unité: '€/mois',
			contexte,
		})?.nodeValue as number) ?? 0

	return {
		IRC,
		Urssaf,
		chômage,
	}
}
