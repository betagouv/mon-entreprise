import React, { Component } from 'react'
import { Trans, translate } from 'react-i18next'
import { compose } from 'ramda'
import classNames from 'classnames'
import { connect } from 'react-redux'
import './Examples.css'
import { setExample } from '../../actions'
import { capitalise0 } from '../../utils'

@connect(
	state => ({
		parsedRules: state.parsedRules,
		themeColours: state.themeColours
	}),
	dispatch => ({
		setExample: compose(dispatch, setExample)
	})
)
@translate()
export default class Examples extends Component {
	render() {
		let {
				situationExists,
				rule,
				themeColours,
				setExample,
				currentExample
			} = this.props,
			{ examples } = rule

		if (!examples) return null
		return (
			<div id="examples">
				<h2>
					<Trans i18nKey="examples">Exemples de calcul</Trans>{' '}
					<small>
						<Trans i18nKey="clickexample">
							Cliquez sur un exemple pour le tester
						</Trans>
					</small>
				</h2>
				<ul>
					{examples.map(ex => (
						<Example
							key={ex.nom}
							{...{ ex, rule, currentExample, setExample, themeColours }}
						/>
					))}
				</ul>

				{situationExists &&
					currentExample && (
						<div>
							<button
								id="injectSituation"
								onClick={() => setExample(null)}
								style={{ background: themeColours.colour }}>
								<Trans i18nKey="cancelExample">Revenir à votre situation</Trans>
							</button>
						</div>
					)}
			</div>
		)
	}
}

let Example = ({
	ex: { nom, 'valeur attendue': expected, situation },
	rule,
	currentExample,
	setExample,
	themeColours: { colour, textColour }
}) => (
	<li
		key={nom}
		className={classNames('example', {
			selected: currentExample && currentExample.name == nom
		})}
		onClick={() =>
			currentExample && currentExample.name == nom
				? setExample(null)
				: setExample(nom, situation, rule.dottedName)
		}>
		<button className="name" style={{ color: textColour, background: colour }}>
			{capitalise0(nom)}
		</button>
	</li>
)
