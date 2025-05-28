/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { DottedName } from 'modele-social'
import Engine, { Evaluation, PublicodesExpression } from 'publicodes'
import { expect } from 'vitest'

import { round } from '@/utils/number'

import { PublicodesTypes } from '../helpers/PublicodesTypes'

type RuleType =
	| PublicodesExpression
	| {
			dottedName: PublicodesExpression
			precision?: number
	  }

const toEvaluate = function <T extends PublicodesTypes>(
	engine: Engine,
	rule: RuleType,
	value: Evaluation<T>
) {
	let dottedName: PublicodesExpression
	let precision: number | null = null
	if (typeof rule === 'object' && 'dottedName' in rule) {
		dottedName = rule.dottedName as PublicodesExpression
		if ('precision' in rule && typeof rule.precision === 'number') {
			precision = rule.precision
		}
	} else {
		dottedName = rule
	}
	const evaluation = engine.evaluate(dottedName).nodeValue
	const formattedEvaluation = precision
		? round(evaluation as number, precision)
		: evaluation
	const pass = formattedEvaluation === value

	const ruleName =
		rule instanceof String || rule instanceof Number
			? rule
			: (rule as Record<string, unknown>).valeur
			? (rule as Record<string, unknown>).valeur
			: JSON.stringify(rule, null, 2)

	if (pass) {
		return {
			message: () =>
				// `this` context will have correct typings
				// @ts-ignore
				`expected ${this.utils.printReceived(
					evaluation
					// @ts-ignore
				)} not to equal ${this.utils.printExpected(
					// eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-base-to-string
					`${value}`
					// eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-base-to-string
				)} for rule ${ruleName}`,
			pass: true,
		}
	} else {
		return {
			message: () =>
				// @ts-ignore
				`expected ${this.utils.printReceived(
					evaluation
					// @ts-ignore
					// eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-base-to-string
				)} to equal ${this.utils.printExpected(
					`${value}`
					// eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-base-to-string
				)} for rule ${dottedName}`,
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
