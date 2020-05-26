import yaml from 'yaml'
import React from 'react'
import Engine from '../index'
import PublicodeHighlighter from './PublicodeHighlighter'

type Props<Rules extends string> = { dottedName: Rules; engine: Engine<Rules> }
export default function RuleSource<Rules extends string>({
	engine,
	dottedName
}: Props<Rules>) {
	const source = engine.getRules()[dottedName]
	if (!source) {
		return
	}
	return (
		<section>
			<h3>Source publicode</h3>
			<PublicodeHighlighter source={yaml.stringify({ [dottedName]: source })} />
			<p className="ui__ notice">
				Ci-dessus la règle d'origine, écrite en publicode. Publicode est un
				langage déclaratif développé par beta.gouv.fr en partenariat avec
				l'Acoss pour encoder les algorithmes d'intérêt public.{' '}
				<a href="https://publi.codes">En savoir plus.</a>
			</p>
		</section>
	)
}
