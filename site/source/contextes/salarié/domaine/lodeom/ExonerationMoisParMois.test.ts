import { describe, expect, it } from 'vitest'

import {
	getDataAfterGlobalOptionsChange,
	getDataAfterOptionsChange,
	getDataAfterRémunérationChange,
	getDataAfterSituationChange,
} from './ExonerationMoisParMois'
import { initialRéductionMoisParMois } from './MoisParMois'
import { Options } from './Options'
import { annéeAvec, moteurZoneUn } from './test/fixtures'

const janvier = 0
const février = 1
const année = 2025
const moteur = moteurZoneUn('3500 €/an')

const heuresSupplémentaires = (nombre: number): Options => ({
	heuresSupplémentaires: nombre,
	heuresComplémentaires: 0,
	rémunérationETP: 0,
	rémunérationPrimes: 0,
})

describe('getDataAfterRémunérationChange', () => {
	it('calcule l’exonération du mois saisi', () => {
		const données = getDataAfterRémunérationChange(
			janvier,
			3500,
			initialRéductionMoisParMois,
			année,
			moteur,
			'progressive'
		)

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

	it('écrit sur le mois saisi sans toucher aux autres', () => {
		const données = getDataAfterRémunérationChange(
			février,
			3000,
			annéeAvec([3500]),
			année,
			moteur,
			'progressive'
		)

		expect(données[janvier].rémunérationBrute).toBe(3500)
		expect(données[février].rémunérationBrute).toBe(3000)
	})
})

describe('getDataAfterGlobalOptionsChange', () => {
	const étale = (heures: number) =>
		getDataAfterGlobalOptionsChange(
			{ heuresSupplémentaires: heures },
			annéeAvec([3500]),
			année,
			moteur,
			'progressive'
		)

	it('applique les heures supplémentaires du cadre bleu aux douze mois', () => {
		expect(
			étale(5).map((mois) => mois.options.heuresSupplémentaires)
		).toStrictEqual(Array(12).fill(5))
	})

	it('fait varier l’exonération du mois rémunéré', () => {
		expect(étale(5)[janvier].réduction.value).not.toBeCloseTo(
			étale(0)[janvier].réduction.value,
			2
		)
	})

	it('laisse intactes les rémunérations déjà saisies', () => {
		const données = getDataAfterGlobalOptionsChange(
			{ heuresSupplémentaires: 5 },
			annéeAvec([3500, 3000]),
			année,
			moteur,
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
			annéeAvec([3500]),
			année,
			moteur,
			'progressive'
		)

		expect(données[janvier].options.heuresSupplémentaires).toBe(10)
		expect(données[février].options.heuresSupplémentaires).toBe(0)
	})
})

describe('getDataAfterSituationChange', () => {
	it('conserve les options saisies mois par mois', () => {
		const avecOptionsEnJanvier = annéeAvec([3500]).map((mois, index) =>
			index === janvier ? { ...mois, options: heuresSupplémentaires(10) } : mois
		)

		const données = getDataAfterSituationChange(
			avecOptionsEnJanvier,
			année,
			moteur,
			'annuelle'
		)

		expect(données[janvier].options.heuresSupplémentaires).toBe(10)
	})

	it('recalcule la réduction sans tenir compte de celle reçue en entrée', () => {
		const avecUneRéductionFausse = annéeAvec([3500]).map((mois, index) =>
			index === janvier
				? { ...mois, réduction: { ...mois.réduction, value: 9999 } }
				: mois
		)

		const données = getDataAfterSituationChange(
			avecUneRéductionFausse,
			année,
			moteur,
			'progressive'
		)

		expect(données[janvier].réduction.value).toBeCloseTo(214.2, 2)
	})
})
