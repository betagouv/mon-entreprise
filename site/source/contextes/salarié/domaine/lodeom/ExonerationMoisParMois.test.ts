import { sumAll } from 'effect/Number'
import { describe, expect, it } from 'vitest'

import {
	getDataAfterGlobalOptionsChange,
	getDataAfterOptionsChange,
	getDataAfterRémunérationChange,
	getDataAfterSituationChange,
	type ParamètresDeCalcul,
} from './ExonerationMoisParMois'
import { initialRéductionMoisParMois, MonthState } from './MoisParMois'
import { Options } from './Options'
import { annéeAvec, moteurZoneUn } from './test/fixtures'

const janvier = 0
const février = 1
const décembre = 11
const année = 2025
const moteur = moteurZoneUn('3500 €/an')
const calcul: ParamètresDeCalcul = {
	année,
	moteur,
	régularisation: 'progressive',
}

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
			calcul
		)

		expect(données[janvier].réduction.value).toBeCloseTo(214.2, 2)
		expect(données[janvier].réduction.répartition.Urssaf).toBeGreaterThan(0)
	})

	it('calcule l’exonération même quand la situation du moteur ne porte pas encore de rémunération', () => {
		const données = getDataAfterRémunérationChange(
			janvier,
			3500,
			initialRéductionMoisParMois,
			{ ...calcul, moteur: moteurZoneUn() }
		)

		expect(données[janvier].réduction.value).toBeCloseTo(214.2, 2)
	})

	it('écrit sur le mois saisi sans toucher aux autres', () => {
		const données = getDataAfterRémunérationChange(
			février,
			3000,
			annéeAvec([3500]),
			calcul
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
			calcul
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
			calcul
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
			calcul
		)

		expect(données[janvier].options.heuresSupplémentaires).toBe(10)
		expect(données[février].options.heuresSupplémentaires).toBe(0)
	})
})

describe('régularisation', () => {
	// Un mois nettement mieux payé que les autres crée un trop-perçu de réduction,
	// qu'il faut reprendre.
	const annéeAvecUnMoisÉlevé = annéeAvec([
		3500,
		4500,
		...Array<number>(10).fill(3500),
	])
	const totalAnnuel = (données: MonthState[]) =>
		sumAll(données.map((m) => m.réduction.value + m.régularisation.value))

	const selon = (méthode: 'progressive' | 'annuelle') =>
		getDataAfterSituationChange(annéeAvecUnMoisÉlevé, {
			...calcul,
			régularisation: méthode,
		})

	it('reprend le trop-perçu dès le mois où il apparaît, en progressive', () => {
		const données = selon('progressive')

		expect(données[février].régularisation.value).toBeLessThan(0)
		expect(données[février].réduction.value).toBe(0)
	})

	it('ne reprend le trop-perçu qu’en décembre, en annuelle', () => {
		const données = selon('annuelle')

		expect(données[février].régularisation.value).toBe(0)
		expect(données[décembre].régularisation.value).toBeLessThan(0)
	})

	it('ne reprend rien là où la zone n’y donne pas droit', () => {
		const données = getDataAfterSituationChange(annéeAvecUnMoisÉlevé, {
			...calcul,
			régularisation: 'sans',
		})

		expect(données.map((mois) => mois.régularisation.value)).toStrictEqual(
			Array(12).fill(0)
		)
	})

	it('n’y ventile pas non plus la réduction entre organismes', () => {
		const données = getDataAfterSituationChange(annéeAvecUnMoisÉlevé, {
			...calcul,
			régularisation: 'sans',
		})

		expect(données[janvier].réduction.value).toBeGreaterThan(0)
		expect(données[janvier].réduction.répartition).toStrictEqual({
			IRC: 0,
			Urssaf: 0,
			chômage: 0,
		})
	})

	it('aboutit au même total annuel quelle que soit la méthode', () => {
		expect(totalAnnuel(selon('progressive'))).toBeCloseTo(
			totalAnnuel(selon('annuelle')),
			2
		)
	})
})

describe('getDataAfterSituationChange', () => {
	it('conserve les options saisies mois par mois', () => {
		const avecOptionsEnJanvier = annéeAvec([3500]).map((mois, index) =>
			index === janvier ? { ...mois, options: heuresSupplémentaires(10) } : mois
		)

		const données = getDataAfterSituationChange(avecOptionsEnJanvier, {
			...calcul,
			régularisation: 'annuelle',
		})

		expect(données[janvier].options.heuresSupplémentaires).toBe(10)
	})

	it('recalcule la réduction sans tenir compte de celle reçue en entrée', () => {
		const avecUneRéductionFausse = annéeAvec([3500]).map((mois, index) =>
			index === janvier
				? { ...mois, réduction: { ...mois.réduction, value: 9999 } }
				: mois
		)

		const données = getDataAfterSituationChange(avecUneRéductionFausse, calcul)

		expect(données[janvier].réduction.value).toBeCloseTo(214.2, 2)
	})
})
