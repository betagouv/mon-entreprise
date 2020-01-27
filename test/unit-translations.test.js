import { expect } from 'chai'
import { uniq } from 'ramda'
import { rulesFr } from '../source/engine/rules'
import { parseAll } from '../source/engine/traverse'
import unitsTranslations from '../source/locales/units.yaml'

it('has translation for all base units', () => {
	const rules = parseAll(rulesFr)
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
