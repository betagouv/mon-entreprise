import { setExample } from 'Actions/actions'
import classNames from 'classnames'
import { compose } from 'ramda'
import React, { Component } from 'react'
import { Trans, withNamespaces } from 'react-i18next'
import { connect } from 'react-redux'

export default compose(
	connect(
		state => ({
			parsedRules: state.parsedRules,
			themeColours: state.themeColours
		}),
		dispatch => ({
			setExample: compose(
				dispatch,
				setExample
			)
		})
	),
	withNamespaces()
)(
	class Examples extends Component {
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
				<>
					<h2>
						<Trans i18nKey="examples">Exemples</Trans>{' '}
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

					{situationExists && currentExample && (
						<button
							className="ui__ button small"
							onClick={() => setExample(null)}>
							<Trans i18nKey="cancelExample">Revenir à votre situation</Trans>
						</button>
					)}
				</>
			)
		}
	}
)

let Example = ({
	ex: { nom, situation },
	rule,
	currentExample,
	setExample
}) => {
	let selected = currentExample && currentExample.name == nom
	return (
		<li key={nom}>
			<button
				onClick={() =>
					selected
						? setExample(null)
						: setExample(nom, situation, rule.dottedName)
				}
				className={classNames('ui__ button small', {
					selected
				})}>
				{nom}
			</button>
		</li>
	)
}
