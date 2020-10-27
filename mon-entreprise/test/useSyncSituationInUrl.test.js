import { expect } from 'chai'
import Engine, { parseRules } from 'publicodes'
import rules from 'Rules'

import {
	getSearchParamsFromSituation,
	getSituationFromSearchParams
} from '../source/components/utils/useSyncSituationInUrl'

const parsedRules = parseRules(rules)
const engine = new Engine(parsedRules)

describe('useSyncSituationInUrl', () => {
	const questions = Object.entries(parsedRules)
		.filter(([, rule]) => rule['identifiant court'])
		.map(([dottedName, rule]) => [dottedName, rule['identifiant court']])

	it('rules should have unique identifiant court', () => {
		expect(questions.length).to.greaterThan(0)
		expect(questions.length).to.eq(
			new Set(questions.map(([, name]) => name)).size
		)
	})

	describe('getSearchParamsFromSituation', () => {
		;['€/mois', '€/an'].forEach(targetUnit => {
			questions.forEach(([dottedName, queryParam]) => {
				const query = new URLSearchParams(
					`${queryParam}=2000${targetUnit === '€/an' ? '&periode=an' : ''}`
				)
				query.sort()
				it(queryParam, () => {
					expect(
						getSearchParamsFromSituation(
							{
								[dottedName]: `2000 ${targetUnit}`
							},
							targetUnit,
							engine
						)
					).to.equal(query.toString())
				})
			})
		})
	})

	describe('getSituationFromSearchParams', () => {
		;['€/mois', '€/an'].forEach(targetUnit => {
			questions.forEach(([dottedName, queryParam]) => {
				it(dottedName, () => {
					expect(
						getSituationFromSearchParams(
							new URLSearchParams(
								`${queryParam}=2000${
									targetUnit === '€/an' ? '&periode=an' : ''
								}`
							),
							{
								objectifs: questions.map(([dottedName]) => dottedName)
							},
							engine
						)
					).to.deep.equal({
						targetUnit,
						situation: {
							[dottedName]: `2000 ${targetUnit}`
						}
					})
				})
			})
		})
	})
})
