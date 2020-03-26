import { expect } from 'chai'
import { parseRules } from 'Engine'
import rawRules from 'Publicode/rules'
import { uniq } from 'ramda'
import unitsTranslations from '../source/locales/units.yaml'

it('has translation for all base units', () => {
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
