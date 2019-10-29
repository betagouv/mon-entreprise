// Page listing the engine's currently implemented mecanisms and their tests
import { T } from 'Components'
import { ThemeColoursContext } from 'Components/utils/withColours'
import { analyseMany } from 'Engine/traverse'
import React, { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { useSelector } from 'react-redux'
import examples from 'Règles/cas-types.yaml'
import {
	parsedRulesSelector,
	ruleDefaultsSelector
} from 'Selectors/analyseSelectors'
import './ExampleSituations.css'

export default function ExampleSituations() {
	return (
		<div className="ui__ container" id="exampleSituations">
			<h1>
				{emoji('💡 ')}
				<T>Quelques exemples de salaires</T>
			</h1>
			<ul>
				{examples.map(ex => (
					<Example ex={ex} key={ex.nom} />
				))}
			</ul>
		</div>
	)
}

const Example = function Example({ ex: { nom, situation } }) {
	const defaults = useSelector(ruleDefaultsSelector) as object
	const parsedRules = useSelector(parsedRulesSelector)
	const colours = useContext(ThemeColoursContext)
	let [total, net, netAprèsImpôts] = analyseMany(parsedRules, [
			'total',
			'net',
			'net après impôt'
		])(dottedName => ({ ...defaults, ...situation }[dottedName])).targets,
		figures = [
			total,
			{
				dottedName: 'contrat salarié . rémunération . brut de base',
				nodeValue: situation['contrat salarié . rémunération . brut de base'],
				title: 'Salaire brut'
			},
			net,
			{ ...netAprèsImpôts, title: 'Après impôt' }
		],
		de = figures[0].nodeValue,
		à = figures[3].nodeValue,
		percentage = Math.round(((de - à) / de) * 100)

	return (
		<li className="example">
			<h2>{nom}</h2>
			<ul>
				{figures.map(t => (
					<li key={t.dottedName}>
						<h3>{t.title}</h3>
						<span
							style={{ color: colours.textColourOnWhite }}
							className="figure">
							{Math.round(t.nodeValue)} €
						</span>
					</li>
				))}{' '}
				<li key="%">
					<h3>Prélèvements</h3>
					<span style={{ color: colours.textColourOnWhite }} className="figure">
						{percentage} %
					</span>
				</li>
			</ul>
		</li>
	)
}
