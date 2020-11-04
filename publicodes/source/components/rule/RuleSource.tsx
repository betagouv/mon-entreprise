import React, { useState } from 'react'
import emoji from 'react-easy-emoji'
import yaml from 'yaml'
import Engine, { formatValue } from '../../index'
import PublicodesBlock from '../PublicodesBlock'

type Props = { dottedName: string; engine: Engine }
export default function RuleSource({ engine, dottedName }: Props) {
	const [showSource, setShowSource] = useState(false)
	const { rawRule, dependencies } = engine.getParsedRules()[dottedName]
	// When we import a rule in the Publicode Studio, we need to provide a
	// simplified definition of its dependencies to avoid undefined references.
	// We use the current situation value as their simplified definition.
	const dependenciesValues = Object.fromEntries(
		dependencies.map(dottedNameDependency => [
			dottedNameDependency,
			formatValueForStudio(engine.evaluate(dottedNameDependency as string))
		])
	)

	const source = yaml
		.stringify({
			...dependenciesValues,
			[dottedName]: rawRule
		})
		// For clarity add a break line before the main rule
		.replace(`${dottedName}:`, `\n${dottedName}:`)

	return showSource ? (
		<section>
			<h3>Source publicode</h3>
			<p className="ui__ notice">
				Ci-dessous la règle d'origine, écrite en publicodes. Publicodes est un
				langage déclaratif développé par beta.gouv.fr en partenariat avec
				l'Acoss pour encoder les algorithmes d'intérêt public.{' '}
				<a href="https://publi.codes">En savoir plus.</a>
			</p>
			<PublicodesBlock source={source} />

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

// TODO: This formating function should be in the core code. We need to think
// about the different options of the formatting options and our use cases
// (putting a value in the URL #1169, importing a value in the Studio, showing a value
// on screen)
function formatValueForStudio(node: Parameters<typeof formatValue>[0]) {
	const base = formatValue(node)
		.replace(/\s/g, '')
		.replace(',', '.')
	if (base.match(/^[0-9]/) || base === 'Oui' || base === 'Non') {
		return base.toLowerCase()
	} else if (base === '-') {
		return 'non'
	} else {
		return `'${base}'`
	}
}
