import { describe, beforeEach, it, expect, vi } from 'vitest'
import Engine, { parsePublicodes } from 'publicodes'
import rules from 'modele-social'
import {
	getSearchParamsFromSituation,
	getSituationFromSearchParams,
	getRulesParamNames,
	cleanSearchParams,
} from '../source/components/utils/useSearchParamsSimulationSharing'

describe('identifiant court', () => {
	const questions = Object.entries(parsePublicodes(rules))
		.filter(([, ruleNode]) => ruleNode.rawNode['identifiant court'])
		.map(([dottedName, ruleNode]) => [
			dottedName,
			ruleNode.rawNode['identifiant court'],
		])

	it('should be unique amongst rules', () => {
		expect(questions.length).to.greaterThan(0)
		expect(questions.length).to.eq(
			new Set(questions.map(([, name]) => name)).size
		)
	})
})

describe('useSearchParamsSimulationSharing', () => {
	const engine = new Engine(`
rule with:
	identifiant court: panta
	formule: 0
rule without:
	formule: 0
	`)
	const dottedNameParamName = getRulesParamNames(engine.getParsedRules())

	describe('getSearchParamsFromSituation', () => {
		it('builds search params with and without identifiant court', () => {
			expect(
				getSearchParamsFromSituation(
					engine,
					{ 'rule with': '2000€/mois', 'rule without': '1000€/mois' },
					dottedNameParamName
				).toString()
			).to.equal(
				new URLSearchParams(
					'panta=2000€/mois&rule without=1000€/mois'
				).toString()
			)
		})
		it.skip('builds search params with object', () => {
			expect(
				getSearchParamsFromSituation(
					engine,
					{ 'rule without': { 1: 2, 3: { 4: '5' } } },
					dottedNameParamName
				).toString()
			).to.equal(
				new URLSearchParams('rule without={"1":2,"3":{"4":"5"}}').toString()
			)
		})
		it('handles empty situation with proper defaults', () => {
			expect(
				getSearchParamsFromSituation(engine, {}, dottedNameParamName).toString()
			).to.equal('')
		})
	})

	describe('getSituationFromSearchParams', () => {
		it('reads search params with and without identifiant court', () => {
			expect(
				getSituationFromSearchParams(
					new URLSearchParams('panta=2000€/mois&rule without=1000€/mois'),
					dottedNameParamName
				)
			).to.deep.equal({
				'rule with': '2000€/mois',
				'rule without': '1000€/mois',
			})
		})
		it('handles empty search params with proper defaults', () => {
			expect(
				getSituationFromSearchParams(
					new URLSearchParams(''),
					dottedNameParamName
				)
			).to.deep.equal({})
		})
	})
})

describe('useSearchParamsSimulationSharing hook', () => {
	const parsedRules = parsePublicodes(`
rule with:
	identifiant court: panta
	formule: 0
rule without:
	formule: 0
	`)

	const dottedNameParamName = getRulesParamNames(parsedRules)
	let setSearchParams

	beforeEach(() => {
		setSearchParams = vi.fn()
	})
	it('removes searchParams that are in situation', () => {
		const searchParams = new URLSearchParams('panta=123&rule without=333')
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
