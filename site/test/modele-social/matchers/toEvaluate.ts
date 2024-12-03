/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { DottedName } from 'modele-social'
import Engine, { Evaluation, PublicodesExpression } from 'publicodes'
import { expect } from 'vitest'

import { PublicodesTypes } from '../helpers/PublicodesTypes'

const toEvaluate = function <T extends PublicodesTypes>(
	engine: Engine,
	rule: PublicodesExpression,
	value: Evaluation<T>
) {
	const evaluated = engine.evaluate(rule).nodeValue
	const pass = evaluated === value

	if (pass) {
		return {
			message: () =>
				// `this` context will have correct typings
				// @ts-ignore
				`expected ${this.utils.printReceived(
					evaluated
					// @ts-ignore
				)} not to equal ${this.utils.printExpected(
					// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
					`${value}`
				)} for rule ${rule}`,
			pass: true,
		}
	} else {
		return {
			message: () =>
				// @ts-ignore
				`expected ${this.utils.printReceived(
					evaluated
					// @ts-ignore
					// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
				)} to equal ${this.utils.printExpected(`${value}`)} for rule ${rule}`,
			pass: false,
		}
	}
}

const toBeApplicable = function (engine: Engine, rule: DottedName) {
	const pass = engine.evaluate({
		'est applicable': rule,
	}).nodeValue

	if (pass) {
		return {
			message: () => `La règle ${rule} ne devrait pas être applicable`,
			pass: true,
		}
	} else {
		return {
			message: () => `La règle ${rule} devrait être applicable`,
			pass: false,
		}
	}
}

expect.extend({
	toEvaluate,
	toBeApplicable,
})
