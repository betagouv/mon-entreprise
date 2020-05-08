import { expect } from 'chai'
import { parseRules } from 'publicodes'
import { uniq } from 'ramda'
import rawRules from '../source/rules'
import unitsTranslations from '../../publicodes/source/locales/units.yaml'

it('use unit that exists in publicode', () => {
	const rules = parseRules(rawRules)
	const units = uniq(
		Object.keys(rules).reduce(
			(prev, name) => [
				...prev,
				...(rules[name].unit?.numerators ?? []),
				...(rules[name].unit?.denumerators ?? [])
			],
			[]
		)
	)

	const blackList = ['€', '%']
	const translatedKeys = Object.keys(unitsTranslations.en)
	const missingTranslations = units.filter(
		unit => ![...translatedKeys, ...blackList].includes(unit)
	)
	expect(missingTranslations).to.be.empty
})
