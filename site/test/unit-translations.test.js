import rawRules from 'modele-social'
import { parsePublicodes } from 'publicodes'
import { describe, expect, it } from 'vitest'

import unitsTranslations from '../source/locales/units.yaml'

describe('Tests units', function () {
	it('use unit that exists in publicodes', function () {
		const { parsedRules } = parsePublicodes(rawRules)
		const units = [
			...new Set(
				Object.keys(parsedRules).reduce(
					(prev, name) => [
						...prev,
						...(parsedRules[name].unit?.numerators ?? []),
						...(parsedRules[name].unit?.denumerators ?? []),
					],
					[]
				)
			),
		]

		const blackList = ['€', '%']
		const translatedKeys = Object.keys(unitsTranslations.en)
		const missingTranslations = units.filter(
			(unit) => ![...translatedKeys, ...blackList].includes(unit)
		)
		expect(missingTranslations).to.be.empty
	})
})
