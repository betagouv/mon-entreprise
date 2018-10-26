// Page listing the engine's currently implemented mecanisms and their tests
import React, { Component } from 'react'
import './ExampleSituations.css'
import examples from 'Règles/cas-types.yaml'
import { analyseMany } from 'Engine/traverse'
import { connect } from 'react-redux'
import {
	ruleDefaultsSelector,
	parsedRulesSelector
} from 'Selectors/analyseSelectors'
import withColours from 'Components/utils/withColours'

class ExempleSituations extends Component {
	render() {
		return (
			<div className="ui__ container" id="exampleSituations">
				<h1>Exemples de calculs</h1>
				<ul>
					{examples.map(ex => (
						<Example ex={ex} key={ex.nom} />
					))}
				</ul>
			</div>
		)
	}
}
@connect(state => ({
	defaults: ruleDefaultsSelector(state),
	parsedRules: parsedRulesSelector(state)
}))
@withColours
class Example extends Component {
	render() {
		let {
				ex: { nom, situation },
				parsedRules,
				defaults,
				colours
			} = this.props,
			[total, net, netAprèsImpôts] = analyseMany(parsedRules, [
				'total',
				'net',
				'net après impôt'
			])(dottedName => ({ ...defaults, ...situation }[dottedName])).targets,
			figures = [
				total,
				do {
					let dottedName = 'contrat salarié . salaire . brut de base'
					;({
						dottedName,
						nodeValue: situation[dottedName],
						title: 'Salaire brut'
					})
				},
				net,
				{ ...netAprèsImpôts, title: 'Net après impôt' }
			]

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
				</ul>
			</li>
		)
	}
}

export default ExempleSituations
