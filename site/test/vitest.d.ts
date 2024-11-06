import 'vitest'

import { DottedName } from 'modele-social'
import { Evaluation } from 'publicodes'

import { PublicodesTypes } from './modele-social/helpers/PublicodesTypes'

interface CustomMatchers<R = unknown> {
	toEvaluate: <T extends PublicodesTypes>(
		rule: DottedName,
		value: Evaluation<T>
	) => R
}

declare module 'vitest' {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	interface Assertion<T = any> extends CustomMatchers<T> {}
	interface AsymmetricMatchersContaining extends CustomMatchers {}
}
