import Engine from 'publicodes'

import { DottedName } from '@/domaine/publicodes/DottedName'
import { SituationPublicodes } from '@/domaine/SituationPublicodes'

import { Options } from './Options'
import {
	getDateForContexte,
	heuresComplémentairesDottedName,
	heuresSupplémentairesDottedName,
	rémunérationBruteDottedName,
} from './publicodes'

/**
 * Il faut adapter le Smic à la durée de travail réalisée ce mois-ci par le ou la
 * salariée (heures supplémentaires, temps partiel, mois incomplet...).
 */
export const getSMICMensuelAvecOptions = (
	year: number,
	monthIndex: number,
	rémunérationBrute: number,
	options: Options,
	engine: Engine<DottedName>
): number => {
	const date = getDateForContexte(year, monthIndex)
	const contexte = {
		date,
		[rémunérationBruteDottedName]: rémunérationBrute,
		[heuresSupplémentairesDottedName]: options.heuresSupplémentaires,
		[heuresComplémentairesDottedName]: options.heuresComplémentaires,
	} as SituationPublicodes

	const SMICMensuel = engine.evaluate({
		valeur: 'salarié . cotisations . exonérations . lodeom . montant . smic',
		contexte,
	}).nodeValue as number

	const moisComplet = !options.rémunérationETP
	if (moisComplet) {
		return SMICMensuel
	}

	contexte['salarié . mois incomplet . rémunération équivalente mois complet'] =
		options.rémunérationETP
	if (options.rémunérationPrimes) {
		contexte[
			"salarié . mois incomplet . rémunération non impactée par l'absence"
		] = options.rémunérationPrimes
	}
	const SMIC = engine.evaluate({
		valeur: 'salarié . mois incomplet . SMIC équivalent',
		contexte,
	}).nodeValue as number

	return SMIC
}
