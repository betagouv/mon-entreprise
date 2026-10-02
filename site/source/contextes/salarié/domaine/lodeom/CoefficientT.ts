import Engine from 'publicodes'

import { DottedName } from '@/domaine/publicodes/DottedName'
import { SituationPublicodes } from '@/domaine/SituationPublicodes'

import { getDateForContexte, rémunérationBruteDottedName } from './publicodes'

export const getCoefT = (
	year: number,
	monthIndex: number,
	rémunérationBrute: number,
	engine: Engine<DottedName>
): number => {
	const date = getDateForContexte(year, monthIndex)
	const contexte = {
		date,
		[rémunérationBruteDottedName]: rémunérationBrute,
	} as SituationPublicodes

	return engine.evaluate({
		valeur: 'salarié . cotisations . exonérations . T',
		contexte,
	}).nodeValue as number
}
