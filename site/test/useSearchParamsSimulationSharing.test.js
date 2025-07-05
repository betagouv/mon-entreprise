import rules from 'modele-social'
import Engine, { parsePublicodes } from 'publicodes'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import yaml from 'yaml'

import {
	cleanSearchParams,
	getRulesParamNames,
	getSearchParams,
	getSituationFromSearchParams,
} from '../source/hooks/useSearchParamsSimulationSharing'

describe('identifiant court', () => {
	const questions = Object.entries(parsePublicodes(rules).parsedRules)
		.filter(([, ruleNode]) => ruleNode.rawNode['identifiant court'])
		.map(([dottedName, ruleNode]) => [
			dottedName,
			ruleNode.rawNode['identifiant court'],
		])

	it('should be unique amongst rules', () => {
		expect(questions).toHaveLength(
			new Set(questions.map(([, name]) => name)).size
		)
	})
})

describe('useSearchParamsSimulationSharing', () => {
	const engine = new Engine(
		yaml.parse(`
rule with:
  identifiant court: panta
  formule: 0
rule without:
  formule: 0
`)
	)
	const dottedNameParamName = getRulesParamNames(engine.getParsedRules())

	describe('getSearchParamsFromSituation', () => {
		it('builds search params with and without identifiant court', () => {
			expect(
				getSearchParams(
					engine,
					{ 'rule with': '2000€/mois', 'rule without': '1000€/mois' },
					dottedNameParamName,
					'€/an'
				).toString()
			).toBe(
				new URLSearchParams(
					'panta=2000€/mois&rule without=1000€/mois&unite=€/an'
				).toString()
			)
		})
		it('builds search params with object', () => {
			expect(
				getSearchParams(
					engine,
					{ 'rule without': { 1: 2, 3: { 4: '5' } } },
					dottedNameParamName,
					'€/an'
				).toString()
			).toBe(
				new URLSearchParams('rule without={"1":2,"3":{"4":"5"}}').toString() +
					'&unite=%E2%82%AC%2Fan'
			)
		})
		it('handles empty situation with proper defaults', () => {
			expect(
				getSearchParams(engine, {}, dottedNameParamName, '€/mois').toString()
			).toBe('unite=%E2%82%AC%2Fmois')
		})
	})

	describe('getSituationFromSearchParams', () => {
		it('reads search params with and without identifiant court', () => {
			const result = getSituationFromSearchParams(
				new URLSearchParams('panta=2000€/mois&rule without=1000€/mois'),
				dottedNameParamName
			)

			expect(result['rule with']).toMatchObject({
				_tag: 'Montant',
				valeur: 2000,
				unité: '€/mois',
			})
			expect(result['rule without']).toMatchObject({
				_tag: 'Montant',
				valeur: 1000,
				unité: '€/mois',
			})
		})
		it('handles empty search params with proper defaults', () => {
			expect(
				getSituationFromSearchParams(
					new URLSearchParams(''),
					dottedNameParamName
				)
			).toEqual({})
		})
	})
})

describe('useSearchParamsSimulationSharing hook', () => {
	const { parsedRules } = parsePublicodes(
		yaml.parse(
			`
rule with:
  identifiant court: panta
  formule: 0
rule without:
  formule: 0
`
		)
	)

	const dottedNameParamName = getRulesParamNames(parsedRules)
	let setSearchParams

	beforeEach(() => {
		setSearchParams = vi.fn()
	})
	it('removes searchParams that are in situation', () => {
		const searchParams = new URLSearchParams(
			'panta=123&rule without=333&unite=€/mois'
		)
		const newSituation = getSituationFromSearchParams(
			searchParams,
			dottedNameParamName
		)
		cleanSearchParams(
			searchParams,
			setSearchParams,
			dottedNameParamName,
			Object.keys(newSituation)
		)
		expect(setSearchParams).toHaveBeenCalledWith('', { replace: true })
	})
	it("doesn't remove other search params", () => {
		const searchParams = new URLSearchParams(
			'rule without=123&utm_campaign=marketing'
		)
		const newSituation = getSituationFromSearchParams(
			searchParams,
			dottedNameParamName
		)
		cleanSearchParams(
			searchParams,
			setSearchParams,
			dottedNameParamName,
			Object.keys(newSituation)
		)
		expect(setSearchParams).toHaveBeenCalledWith('utm_campaign=marketing', {
			replace: true,
		})
	})
})
