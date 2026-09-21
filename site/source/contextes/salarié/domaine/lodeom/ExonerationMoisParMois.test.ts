import rules from 'modele-social'
import Engine from 'publicodes'
import { describe, expect, it } from 'vitest'

import { DottedName } from '@/domaine/publicodes/DottedName'

import { situationSalarié } from '../SituationSalarie'
import {
	getDataAfterGlobalOptionsChange,
	getDataAfterOptionsChange,
	getDataAfterRémunérationChange,
	getDataAfterSituationChange,
} from './ExonerationMoisParMois'
import { initialRéductionMoisParMois, MonthState } from './MoisParMois'
import { Options } from './Options'

const janvier = 0
const février = 1
const année = 2025

const moteurZoneUn = (rémunérationAnnuelle?: string) =>
	new Engine(rules).setSituation({
		...situationSalarié,
		'salarié . cotisations . exonérations . zones lodeom': "'zone un'",
		'salarié . cotisations . exonérations . lodeom . zone un . barèmes':
			"'compétitivité'",
		...(rémunérationAnnuelle
			? { 'salarié . rémunération . brut': rémunérationAnnuelle }
			: {}),
	}) as Engine<DottedName>

const heuresSupplémentaires = (nombre: number): Options => ({
	heuresSupplémentaires: nombre,
	heuresComplémentaires: 0,
	rémunérationETP: 0,
	rémunérationPrimes: 0,
})

const avecRémunération = (
	mois: number,
	rémunérationBrute: number,
	données: MonthState[] = initialRéductionMoisParMois
) =>
	getDataAfterRémunérationChange(
		mois,
		rémunérationBrute,
		données,
		année,
		moteurZoneUn('3500 €/an'),
		'progressive'
	)

describe('getDataAfterRémunérationChange', () => {
	it('calcule l’exonération du mois saisi', () => {
		const données = avecRémunération(janvier, 3500)

		expect(données[janvier].réduction.value).toBeCloseTo(214.2, 2)
		expect(données[janvier].réduction.répartition.Urssaf).toBeGreaterThan(0)
	})

	it('calcule l’exonération même quand la situation du moteur ne porte pas encore de rémunération', () => {
		const données = getDataAfterRémunérationChange(
			janvier,
			3500,
			initialRéductionMoisParMois,
			année,
			moteurZoneUn(),
			'progressive'
		)

		expect(données[janvier].réduction.value).toBeCloseTo(214.2, 2)
	})
})

describe('getDataAfterGlobalOptionsChange', () => {
	it('applique les heures supplémentaires du cadre bleu aux douze mois', () => {
		const données = getDataAfterGlobalOptionsChange(
			{ heuresSupplémentaires: 5 },
			avecRémunération(janvier, 3500),
			année,
			moteurZoneUn('3500 €/an'),
			'progressive'
		)

		expect(
			données.map((mois) => mois.options.heuresSupplémentaires)
		).toStrictEqual(Array(12).fill(5))
	})

	it('fait varier l’exonération du mois rémunéré', () => {
		const sansHeuresSup = avecRémunération(janvier, 3500)
		const avecHeuresSup = getDataAfterGlobalOptionsChange(
			{ heuresSupplémentaires: 5 },
			sansHeuresSup,
			année,
			moteurZoneUn('3500 €/an'),
			'progressive'
		)

		expect(avecHeuresSup[janvier].réduction.value).not.toBeCloseTo(
			sansHeuresSup[janvier].réduction.value,
			2
		)
	})

	it('laisse intactes les rémunérations déjà saisies', () => {
		const données = getDataAfterGlobalOptionsChange(
			{ heuresSupplémentaires: 5 },
			avecRémunération(février, 3000, avecRémunération(janvier, 3500)),
			année,
			moteurZoneUn('6500 €/an'),
			'progressive'
		)

		expect(données[janvier].rémunérationBrute).toBe(3500)
		expect(données[février].rémunérationBrute).toBe(3000)
	})
})

describe('getDataAfterOptionsChange', () => {
	it('n’applique les options qu’au mois saisi', () => {
		const données = getDataAfterOptionsChange(
			janvier,
			heuresSupplémentaires(10),
			avecRémunération(janvier, 3500),
			année,
			moteurZoneUn('3500 €/an'),
			'progressive'
		)

		expect(données[janvier].options.heuresSupplémentaires).toBe(10)
		expect(données[février].options.heuresSupplémentaires).toBe(0)
	})
})

describe('getDataAfterSituationChange', () => {
	it('conserve les options saisies mois par mois', () => {
		const moteur = moteurZoneUn('3500 €/an')
		const avecOptionsDeJanvier = getDataAfterOptionsChange(
			janvier,
			heuresSupplémentaires(10),
			avecRémunération(janvier, 3500),
			année,
			moteur,
			'progressive'
		)

		const données = getDataAfterSituationChange(
			avecOptionsDeJanvier,
			année,
			moteur,
			'annuelle'
		)

		expect(données[janvier].options.heuresSupplémentaires).toBe(10)
	})
})
