import { pipe } from 'effect'
import * as O from 'effect/Option'
import { Evaluation, PublicodesExpression } from 'publicodes'

import { OuiNon } from '@/domaine/OuiNon'

export const OuiNonAdapter = {
	decode: (valeur: Evaluation<boolean>): O.Option<OuiNon> =>
		pipe(
			valeur,
			O.fromNullable,
			O.map((brute) => (brute ? 'oui' : 'non'))
		),
	encode: (valeur: O.Option<OuiNon>) =>
		O.getOrUndefined(valeur) satisfies PublicodesExpression | undefined,
}
