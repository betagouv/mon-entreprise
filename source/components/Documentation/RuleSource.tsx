import { ParsedRule } from 'Engine/types'
import { safeDump } from 'js-yaml'
import React from 'react'
import rules from 'Rules'
import PublicodeHighlighter from '../ui/PublicodeHighlighter'

type RuleSourceProps = Pick<ParsedRule, 'dottedName'>

export default function RuleSource({ dottedName }: RuleSourceProps) {
	let source = rules[dottedName]

	return (
		<section>
			<h3>Source publicode</h3>
			<PublicodeHighlighter source={safeDump({ [dottedName]: source })} />
			<p className="ui__ notice">
				Ci-dessus la règle d'origine, écrite en publicode. Publicode est un
				langage déclaratif développé par beta.gouv.fr en partenariat avec
				l'Acoss pour encoder les algorithmes d'intérêt public.{' '}
				<a href="https://publi.codes">En savoir plus.</a>
			</p>
		</section>
	)
}
