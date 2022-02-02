import { it, expect, describe } from 'vitest'
import { parsePublicodes } from 'publicodes'
import { uniq } from 'ramda'
import rawRules from 'modele-social'
import unitsTranslations from '../source/locales/units.yaml'

describe('Tests units', function () {
	it('use unit that exists in publicodes', function () {
		const rules = parsePublicodes(rawRules)
		const units = uniq(
			Object.keys(rules).reduce(
				(prev, name) => [
					...prev,
					...(rules[name].unit?.numerators ?? []),
					...(rules[name].unit?.denumerators ?? []),
				],
				[]
			)
		)

		const blackList = ['€', '%']
		const translatedKeys = Object.keys(unitsTranslations.en)
		const missingTranslations = units.filter(
			(unit) => ![...translatedKeys, ...blackList].includes(unit)
		)
		expect(missingTranslations).to.be.empty
	})
})
