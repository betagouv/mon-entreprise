import 'vitest'

import { Evaluation, PublicodesExpression } from 'publicodes'

import { DottedName } from '@/domaine/publicodes/DottedName'

import { PublicodesTypes } from './modele-social/helpers/PublicodesTypes'

interface CustomMatchers<R = unknown> {
	toEvaluate: <T extends PublicodesTypes>(
		rule:
			| PublicodesExpression
			| {
					rule: PublicodesExpression
					precision?: number
			  },
		value: Evaluation<T>
	) => R
	toBeApplicable: (rule: DottedName) => R
}

declare module 'vitest' {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	interface Assertion<T = any> extends CustomMatchers<T> {}
	interface AsymmetricMatchersContaining extends CustomMatchers {}
}
