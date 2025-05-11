import * as O from 'effect/Option'
import { EvaluatedNode } from 'publicodes'
import { describe, expect, it, vi } from 'vitest'

import { PublicodesAdapter } from '@/domaine/engine/PublicodesAdapter'
import { euros, eurosParAn, eurosParMois, isMontant } from '@/domaine/Montant'
import { OuiNon } from '@/domaine/OuiNon'

describe('RèglePublicodeAdapter', () => {
	describe('decode', () => {
		describe('valeurs nulles ou undefined', () => {
			it('retourne Option.none() pour une valeur null', () => {
				const node = { nodeValue: null } as EvaluatedNode
				expect(PublicodesAdapter.decode(node)).toEqual(O.none())
			})

			it('retourne Option.none() pour une valeur undefined', () => {
				const node = { nodeValue: undefined } as EvaluatedNode
				expect(PublicodesAdapter.decode(node)).toEqual(O.none())
			})
		})

		describe('valeurs booléennes', () => {
			it('convertit true en "oui"', () => {
				const node = { nodeValue: true } as EvaluatedNode
				expect(PublicodesAdapter.decode(node)).toEqual(O.some('oui'))
			})

			it('convertit false en "non"', () => {
				const node = { nodeValue: false } as EvaluatedNode
				expect(PublicodesAdapter.decode(node)).toEqual(O.some('non'))
			})
		})

		describe('valeurs numériques', () => {
			it('convertit les nombres simples', () => {
				const node = {
					nodeValue: 42,
					missingVariables: {},
					unit: undefined,
				} as EvaluatedNode
				const result = PublicodesAdapter.decode(node)
				expect(O.isSome(result)).toBe(true)
				const value = O.getOrThrow(result)
				expect(value).toBe(42)
			})

			it('convertit les nombres avec unité €', () => {
				const node = {
					nodeValue: 1000,
					unit: '€',
					missingVariables: {},
				} as unknown as EvaluatedNode
				const result = PublicodesAdapter.decode(node)
				expect(O.isSome(result)).toBe(true)
				const value = O.getOrThrow(result)
				expect(isMontant(value)).toBe(true)
				if (isMontant(value)) {
					expect(value.valeur).toBe(1000)
					expect(value.unité).toBe('Euro')
				}
			})

			it('convertit les nombres avec unité €/mois', () => {
				const node = {
					nodeValue: 1000,
					unit: '€/mois',
					missingVariables: {},
				} as unknown as EvaluatedNode
				const result = PublicodesAdapter.decode(node)
				expect(O.isSome(result)).toBe(true)
				const value = O.getOrThrow(result)
				expect(isMontant(value)).toBe(true)
				if (isMontant(value)) {
					expect(value.valeur).toBe(1000)
					expect(value.unité).toBe('EuroParMois')
				}
			})
		})

		describe('valeurs de date', () => {
			it('convertit les dates publicodes en dates ISO', () => {
				const publicodeDate = '01/01/2023'
				const node = {
					nodeValue: publicodeDate,
					missingVariables: {},
				} as EvaluatedNode
				const result = PublicodesAdapter.decode(node)
				expect(O.isSome(result)).toBe(true)
				expect(O.getOrThrow(result)).toBe('2023-01-01')
			})
		})

		describe('valeurs string', () => {
			it("extrait la valeur entre guillemets simples ('valeur')", () => {
				const node = {
					nodeValue: "'texte entre guillemets'",
					missingVariables: {},
				} as EvaluatedNode
				expect(PublicodesAdapter.decode(node)).toEqual(
					O.some('texte entre guillemets')
				)
			})

			it("retourne la chaîne telle quelle si elle n'est pas entre guillemets", () => {
				const node = {
					nodeValue: 'texte sans guillemets',
					missingVariables: {},
				} as EvaluatedNode
				expect(PublicodesAdapter.decode(node)).toEqual(
					O.some('texte sans guillemets')
				)
			})

			it("gère correctement une chaîne qui contient des guillemets à l'intérieur", () => {
				const node = {
					nodeValue: "texte avec 'guillemets",
					missingVariables: {},
				} as EvaluatedNode
				expect(PublicodesAdapter.decode(node)).toEqual(
					O.some("texte avec 'guillemets")
				)
			})
		})

		describe('valeurs non prises en charge', () => {
			it('affiche un avertissement et retourne Option.none() pour les types non pris en charge', () => {
				const consoleWarnSpy = vi
					.spyOn(console, 'warn')
					.mockImplementation(() => {})

				const node = {
					nodeValue: { complexObject: true },
					missingVariables: {},
				} as unknown as EvaluatedNode
				expect(PublicodesAdapter.decode(node)).toEqual(O.none())
				expect(consoleWarnSpy).toHaveBeenCalled()

				consoleWarnSpy.mockRestore()
			})
		})
	})

	describe('encode', () => {
		describe('valeurs None', () => {
			it('retourne undefined pour Option.none()', () => {
				expect(PublicodesAdapter.encode(O.none())).toBeUndefined()
			})
		})

		describe('valeurs OuiNon', () => {
			it('retourne la valeur OuiNon directement', () => {
				expect(PublicodesAdapter.encode(O.some('oui' as OuiNon))).toBe('oui')
				expect(PublicodesAdapter.encode(O.some('non' as OuiNon))).toBe('non')
			})
		})

		describe('valeurs Montant', () => {
			it('retourne une chaine formatée pour les valeurs Montant', () => {
				const montantEuros = euros(1_000)
				const montantEurosParMois = eurosParMois(2_000)
				const montantEurosParAn = eurosParAn(24_000)

				const resultatEuros = PublicodesAdapter.encode(
					O.some(montantEuros)
				) as string
				expect(resultatEuros.replace(/\u202F/g, ' ')).toBe('1 000 €')

				const resultatMois = PublicodesAdapter.encode(
					O.some(montantEurosParMois)
				) as string
				expect(resultatMois.replace(/\u202F/g, ' ')).toBe('2 000 €/mois')

				const resultatAn = PublicodesAdapter.encode(
					O.some(montantEurosParAn)
				) as string
				expect(resultatAn.replace(/\u202F/g, ' ')).toBe('24 000 €/an')
			})
		})

		describe('valeurs numériques', () => {
			it('retourne la valeur numérique directement', () => {
				expect(PublicodesAdapter.encode(O.some(42))).toBe(42)
				expect(PublicodesAdapter.encode(O.some(0))).toBe(0)
				expect(PublicodesAdapter.encode(O.some(-123.45))).toBe(-123.45)
			})
		})

		describe('valeurs de date', () => {
			it('convertit les dates ISO en dates publicodes', () => {
				const isoDate = '2023-01-01'
				const publicodeDate = '01/01/2023'
				expect(PublicodesAdapter.encode(O.some(isoDate))).toBe(publicodeDate)
			})
		})

		describe('valeurs de chaîne', () => {
			it('entoure les chaînes de guillemets simples', () => {
				expect(PublicodesAdapter.encode(O.some('texte simple'))).toBe(
					"'texte simple'"
				)
				expect(PublicodesAdapter.encode(O.some(''))).toBe("''")
			})

			it('gère correctement les chaînes qui contiennent déjà des guillemets', () => {
				expect(
					PublicodesAdapter.encode(
						O.some("texte avec 'guillemets' à l'intérieur")
					)
				).toBe("'texte avec 'guillemets' à l'intérieur'")
			})
		})
	})
})
