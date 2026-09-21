import rules from 'modele-social'
import Engine from 'publicodes'

import { DottedName } from '@/domaine/publicodes/DottedName'

import { situationSalarié } from '../../SituationSalarie'
import { initialRéductionMoisParMois, MonthState } from '../MoisParMois'

export const moteurZoneUn = (rémunérationAnnuelle?: string) =>
	new Engine(rules).setSituation({
		...situationSalarié,
		'salarié . cotisations . exonérations . zones lodeom': "'zone un'",
		'salarié . cotisations . exonérations . lodeom . zone un . barèmes':
			"'compétitivité'",
		...(rémunérationAnnuelle
			? { 'salarié . rémunération . brut': rémunérationAnnuelle }
			: {}),
	}) as Engine<DottedName>

export const sansOptions = {
	heuresSupplémentaires: 0,
	heuresComplémentaires: 0,
	rémunérationETP: 0,
	rémunérationPrimes: 0,
}

export const annéeAvec = (rémunérations: number[]): MonthState[] =>
	initialRéductionMoisParMois.map((mois, index) => ({
		...mois,
		rémunérationBrute: rémunérations[index] ?? 0,
	}))
