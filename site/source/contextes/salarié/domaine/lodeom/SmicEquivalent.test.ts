import rules, { RègleModèleSocial } from 'modele-social'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

import { DottedName } from '@/domaine/publicodes/DottedName'

import { getSMICMensuelAvecOptions } from './SmicEquivalent'

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
