import rules, { RègleModèleSocial } from 'modele-social'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

import { DottedName } from '@/domaine/publicodes/DottedName'
import { configLodeom } from '@/pages/simulateurs/lodeom/simulationConfig'

import {
	getDataAfterGlobalOptionsChange,
	getDataAfterOptionsChange,
	getDataAfterRémunérationChange,
	getDataAfterSituationChange,
	getSMICMensuelAvecOptions,
	initialRéductionMoisParMois,
	MonthState,
	Options,
} from './utils'

const sansOptions = {
	heuresSupplémentaires: 0,
	heuresComplémentaires: 0,
	rémunérationETP: 0,
	rémunérationPrimes: 0,
}

describe('Calculs pour la Lodeom', () => {
	let engine: Engine<RègleModèleSocial>
	let year: number
	beforeEach(() => {
		engine = new Engine(rules, { warn: false })
		year = Number(
			(engine.evaluate('date').nodeValue as string).toString().slice(-4)
		)
	})

	describe('Smic', () => {
		describe('pour un mois complet', () => {
			it.each([['zone un'], ['zone deux']])(
				'en zone %s, vaut le Smic au 1er janvier quel que soit le mois en cours',
				(zone) => {
					const smic1erJanvier = engine.evaluate({
						valeur: 'SMIC',
						contexte: {
							date: `01/01/${year}`,
						},
					}).nodeValue as number

					const e = engine.setSituation({
						'salarié . cotisations . exonérations . zones lodeom': `"${zone}"`,
					}) as Engine<DottedName>
					const smicUtiliséEnFévrier = getSMICMensuelAvecOptions(
						year,
						1,
						3000,
						sansOptions,
						e
					)
					const smicUtiliséEnJuillet = getSMICMensuelAvecOptions(
						year,
						6,
						3000,
						sansOptions,
						e
					)

					expect(smicUtiliséEnFévrier).toEqual(smic1erJanvier)
					expect(smicUtiliséEnJuillet).toEqual(smic1erJanvier)
				}
			)

			it('à Mayotte, vaut le Smic du mois en cours', () => {
				const smicJuillet = engine.evaluate({
					valeur: 'SMIC',
					contexte: {
						date: `01/07/${year}`,
						'établissement . commune . département': "'Mayotte'",
					},
					unité: '€/mois',
				}).nodeValue as number

				const e = engine.setSituation({
					'salarié . cotisations . exonérations . zones lodeom': "'mayotte'",
					'établissement . commune . département': "'Mayotte'",
				}) as Engine<DottedName>
				const smicUtiliséEnJuillet = getSMICMensuelAvecOptions(
					year,
					6,
					3000,
					sansOptions,
					e
				)

				expect(smicUtiliséEnJuillet).toEqual(smicJuillet)
			})

			it('est augmenté du nombre d’heures supplémentaires', () => {
				const smicMensuel = engine.evaluate({
					valeur: 'SMIC',
					contexte: {
						date: `01/01/${year}`,
					},
				}).nodeValue as number
				const smicHoraire = engine.evaluate({
					valeur: 'SMIC . horaire',
					contexte: {
						date: `01/01/${year}`,
					},
				}).nodeValue as number

				const options = {
					...sansOptions,
					heuresSupplémentaires: 10,
				}
				const e = engine.setSituation({
					'salarié . cotisations . exonérations . zones lodeom': "'zone un'",
				}) as Engine<DottedName>
				const smicUtilisé = getSMICMensuelAvecOptions(year, 1, 3000, options, e)

				expect(smicUtilisé).toEqual(smicMensuel + 10 * smicHoraire)
			})
		})

		describe('pour un mois incomplet', () => {
			const options = {
				...sansOptions,
				rémunérationETP: 4000,
			}

			it.each([['zone un'], ['zone deux']])(
				'en zone %s, vaut le Smic au 1er janvier proratisé quel que soit le mois en cours',
				(zone) => {
					const smic1erJanvier = engine.evaluate({
						valeur: 'SMIC',
						contexte: {
							date: `01/01/${year}`,
						},
					}).nodeValue as number

					const e = engine.setSituation({
						'salarié . cotisations . exonérations . zones lodeom': `"${zone}"`,
					}) as Engine<DottedName>
					const smicUtiliséEnFévrier = getSMICMensuelAvecOptions(
						year,
						1,
						3000,
						options,
						e
					)
					const smicUtiliséEnJuillet = getSMICMensuelAvecOptions(
						year,
						6,
						3000,
						options,
						e
					)

					expect(Math.round(smicUtiliséEnFévrier)).toEqual(
						Math.round((3_000 / 4_000) * smic1erJanvier)
					)
					expect(Math.round(smicUtiliséEnJuillet)).toEqual(
						Math.round((3_000 / 4_000) * smic1erJanvier)
					)
				}
			)

			it('à Mayotte, vaut le Smic du mois en cours proratisé', () => {
				const smicJuillet = engine.evaluate({
					valeur: 'SMIC',
					contexte: {
						date: `01/07/${year}`,
						'établissement . commune . département': "'Mayotte'",
					},
				}).nodeValue as number

				const e = engine.setSituation({
					'salarié . cotisations . exonérations . zones lodeom': "'mayotte'",
					'établissement . commune . département': "'Mayotte'",
				}) as Engine<DottedName>
				const smicUtiliséEnJuillet = getSMICMensuelAvecOptions(
					year,
					6,
					3000,
					options,
					e
				)

				expect(Math.round(smicUtiliséEnJuillet)).toEqual(
					Math.round((3_000 / 4_000) * smicJuillet)
				)
			})
		})
	})
})

const janvier = 0
const février = 1
const année = 2025

const moteurZoneUn = (rémunérationAnnuelle?: string) =>
	new Engine(rules).setSituation({
		...configLodeom.situation,
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
