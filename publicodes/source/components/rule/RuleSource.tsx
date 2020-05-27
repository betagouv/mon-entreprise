import yaml from 'yaml'
import React, { useState } from 'react'
import Engine from '../../index'
import PublicodeHighlighter from '../PublicodeHighlighter'
import emoji from 'react-easy-emoji'

type Props<Rules extends string> = { dottedName: Rules; engine: Engine<Rules> }
export default function RuleSource<Rules extends string>({
	engine,
	dottedName
}: Props<Rules>) {
	const [showSource, setShowSource] = useState(false)
	const source = engine.getParsedRules()[dottedName].rawRule
	return showSource ? (
		<section>
			<h3>Source publicode</h3>
			<PublicodeHighlighter source={yaml.stringify({ [dottedName]: source })} />
			<p className="ui__ notice">
				Ci-dessus la règle d'origine, écrite en publicodes. Publicodes est un
				langage déclaratif développé par beta.gouv.fr en partenariat avec
				l'Acoss pour encoder les algorithmes d'intérêt public.{' '}
				<a href="https://publi.codes">En savoir plus.</a>
			</p>
		</section>
	) : (
		<p
			css={`
				text-align: right;
			`}
		>
			<button
				className="ui__ simple small button"
				onClick={() => setShowSource(true)}
			>
				{emoji('✍️')} Voir la règle publicodes
			</button>
		</p>
	)
}
