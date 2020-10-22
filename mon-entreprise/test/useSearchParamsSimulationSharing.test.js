import { expect } from 'chai'
var sinon = require('sinon')
import Engine, { parsePublicodes } from 'publicodes'
import rules from 'modele-social'
import {
	getSearchParamsFromSituation,
	getSituationFromSearchParams,
	getRulesParamNames,
	serialize,
	deserialize,
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
	const someRules = parsePublicodes(`
rule with:
	identifiant court: panta
	formule: 0
rule without:
	formule: 0
	`)
	const dottedNameParamName = getRulesParamNames(
		new Engine(someRules).getRules()
	)

	describe('getSearchParamsFromSituation', () => {
		it('builds search params with and without identifiant court', () => {
			expect(
				getSearchParamsFromSituation(
					{ 'rule with': '2000 €/mois', 'rule without': '1000 €/mois' },
					'€/mois',
					dottedNameParamName
				).toString()
			).to.equal(
				new URLSearchParams(
					'_targetUnit=€/mois&panta=2000 €/mois&rule without=1000 €/mois'
				).toString()
			)
		})
		it('builds search params with object', () => {
			expect(
				getSearchParamsFromSituation(
					{ 'rule without': { 1: 2, 3: { 4: '5' } } },
					'€/mois',
					dottedNameParamName
				).toString()
			).to.equal(
				new URLSearchParams(
					'_targetUnit=€/mois&rule without={"1":2,"3":{"4":"5"}}'
				).toString()
			)
		})
		it('handles empty situation with proper defaults', () => {
			expect(
				getSearchParamsFromSituation({}, '', dottedNameParamName).toString()
			).to.equal('')
		})
	})

	describe('getSituationFromSearchParams', () => {
		it('reads search params with and without identifiant court', () => {
			expect(
				getSituationFromSearchParams(
					new URLSearchParams(
						'_targetUnit=€/an&panta=2000 €/mois&rule without=1000 €/mois'
					),
					dottedNameParamName
				)
			).to.deep.equal({
				situation: {
					'rule with': '2000 €/mois',
					'rule without': '1000 €/mois',
				},
				targetUnit: '€/an',
			})
		})
		it('handles empty search params with proper defaults', () => {
			expect(
				getSituationFromSearchParams(
					new URLSearchParams(''),
					dottedNameParamName
				)
			).to.deep.equal({ situation: {}, targetUnit: '' })
		})
	})

	describe('serialization is somethingpotent', () => {
		expect(deserialize(serialize(1))).to.equal(1)
		expect(deserialize(serialize('1'))).to.equal('1')
		expect(deserialize(serialize({ 1: 2, 3: '4' }))).to.deep.equal({
			1: 2,
			3: '4',
		})
	})
})

describe('useSearchParamsSimulationSharing hook', () => {
	const someRules = parsePublicodes(`
rule with:
	identifiant court: panta
	formule: 0
rule without:
	formule: 0
	`)

	const dottedNameParamName = getRulesParamNames(
		new Engine(someRules).getRules()
	)
	let setSearchParams

	beforeEach(() => {
		setSearchParams = sinon.spy(() => {})
	})
	it('removes searchParams that are in situation', () => {
		const searchParams = new URLSearchParams('panta=123&rule without=333')
		const { situation: newSituation } = getSituationFromSearchParams(
			searchParams,
			dottedNameParamName
		)
		cleanSearchParams(
			searchParams,
			setSearchParams,
			dottedNameParamName,
			Object.keys(newSituation)
		)
		expect(setSearchParams.calledWith('')).to.be.true
	})
	it('removes targetUnit', () => {
		const searchParams = new URLSearchParams('_targetUnit=1&rule without=123')
		const { situation: newSituation } = getSituationFromSearchParams(
			searchParams,
			dottedNameParamName
		)
		cleanSearchParams(
			searchParams,
			setSearchParams,
			dottedNameParamName,
			Object.keys(newSituation)
		)
		expect(setSearchParams.calledWith('')).to.be.true
	})
	it("doesn't remove other search params", () => {
		const searchParams = new URLSearchParams(
			'rule without=123&utm_campaign=marketing'
		)
		const { situation: newSituation } = getSituationFromSearchParams(
			searchParams,
			dottedNameParamName
		)
		cleanSearchParams(
			searchParams,
			setSearchParams,
			dottedNameParamName,
			Object.keys(newSituation)
		)
		expect(setSearchParams.calledWith('utm_campaign=marketing')).to.be.true
	})
})
