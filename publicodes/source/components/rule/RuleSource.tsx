import React, { useState } from 'react'
import emoji from 'react-easy-emoji'
import yaml from 'yaml'
import Engine from '../../index'
import PublicodesBlock from '../PublicodesBlock'

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
			<p className="ui__ notice">
				Ci-dessous la règle d'origine, écrite en publicodes. Publicodes est un
				langage déclaratif développé par beta.gouv.fr en partenariat avec
				l'Acoss pour encoder les algorithmes d'intérêt public.{' '}
				<a href="https://publi.codes">En savoir plus.</a>
			</p>
			<PublicodesBlock source={yaml.stringify({ [dottedName]: source })} />

			<p
				css={`
					text-align: right;
				`}
			>
				<button
					className="ui__ simple small button"
					onClick={() => setShowSource(false)}
				>
					{emoji('❌')} Cacher la règle publicodes
				</button>
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
