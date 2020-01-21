// Page listing the engine's currently implemented mecanisms and their tests
import { ThemeColorsContext } from 'Components/utils/colors'
import { analyseMany } from 'Engine/traverse'
import React, { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import examples from 'Règles/cas-types.yaml'
import {
	parsedRulesSelector,
	ruleDefaultsSelector
} from 'Selectors/analyseSelectors'
import { DottedName } from 'Types/rule'
import './ExampleSituations.css'

export default function ExampleSituations() {
	return (
		<div className="ui__ container" id="exampleSituations">
			<h1>
				{emoji('💡 ')}
				<Trans>Quelques exemples de salaires</Trans>
			</h1>
			<ul>
				{examples.map((ex: any) => (
					<Example ex={ex} key={ex.nom} />
				))}
			</ul>
		</div>
	)
}

const Example = function Example({ ex: { nom, situation } }) {
	const defaults = useSelector(ruleDefaultsSelector)
	const parsedRules = useSelector(parsedRulesSelector)
	const colors = useContext(ThemeColorsContext)
	let [total, net, netAprèsImpôts] = analyseMany(parsedRules, [
			'total',
			'net',
			'net après impôt'
		])(
			(dottedName: DottedName) => ({ ...defaults, ...situation }[dottedName])
		).targets,
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
						<span style={{ color: colors.textColorOnWhite }} className="figure">
							{Math.round(t.nodeValue)} €
						</span>
					</li>
				))}{' '}
				<li key="%">
					<h3>Prélèvements</h3>
					<span style={{ color: colors.textColorOnWhite }} className="figure">
						{percentage} %
					</span>
				</li>
			</ul>
		</li>
	)
}
