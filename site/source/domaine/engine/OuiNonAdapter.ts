import { pipe } from 'effect'
import * as O from 'effect/Option'
import { Evaluation, PublicodesExpression } from 'publicodes'

import { OuiNon, toOuiNon } from '@/domaine/OuiNon'

export const OuiNonAdapter = {
	decode: (valeur: Evaluation<boolean>): O.Option<OuiNon> =>
		pipe(
			valeur,
			O.fromNullable,
			O.map((brute) => toOuiNon(brute))
		),
	encode: (valeur: O.Option<OuiNon>) =>
		O.getOrUndefined(valeur) satisfies PublicodesExpression | undefined,
}
