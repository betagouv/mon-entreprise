/* eslint-disable no-undef */
import { rulesFr } from '../../source/engine/rules'
import { parseAll } from '../../source/engine/traverse'
import { serialiseUnit } from '../../source/engine/units'

// TODO: This should be extanded to maintain a more general concept of rule "type"
it('maintain rule units', () => {
	const rules = parseAll(rulesFr)
	const ruleUnits = Object.fromEntries(
		Object.keys(rules).map(name => [
			name,
			serialiseUnit(rules[name].unit || rules[name].defaultUnit)
		])
	)

	expect(ruleUnits).toMatchSnapshot()
})
