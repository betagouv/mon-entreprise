import React, { Component } from 'react'
import { Trans, translate } from 'react-i18next'
import ResultsGrid from 'Components/ResultsGrid'
import { salaries } from 'Components/TargetSelection'
import { isEmpty, intersection, head, path } from 'ramda'
import Rule from 'Components/rule/Rule'
import './Explanation.css'
import { pluck } from 'ramda'
import { connect } from 'react-redux'

import SearchButton from './SearchButton'
import withColours from './withColours'

@translate()
@withColours
@connect(state => ({
	analysis: state.analysis
}))
export default class Explanation extends Component {
	render() {
		let targetRules = path(['analysis', 'targets'], this.props)
		if (!targetRules) return null

		return (
			<section id="explanation">
				<h3
					className="scrollIndication down"
					style={{
						color: this.props.colours.textColourOnWhite
					}}>
					<i className="fa fa-long-arrow-down" aria-hidden="true" />
					<span> <Trans i18nKey="details">Comprendre mes résultats</Trans></span>
				</h3>
				{this.renderExplanation(targetRules)}
				<div id="warning">
					<p>
						<i className="fa fa-info-circle" aria-hidden="true" />
						<Trans i18nKey="disclaimer">
							Le calcul ne prend pas en compte les conventions et accords
							collectifs, et n'est pas opposable à un bulletin de paie. En cas
							d'écart, vous pouvez en discuter avec votre responsable.
						</Trans>
					</p>
				</div>
			</section>
		)
	}
	renderExplanation(targetRules) {
		if (!isEmpty(intersection(pluck('name', targetRules), salaries)))
			return (
				<>
					<SearchButton />
					<ResultsGrid />
				</>
			) // Problem if targetRules is [salaire net, aides] the Explanation will not explain 'aides'. The user will have to click on Aides to understand it. Should we display a list of <Rule /> sections ?

		if (targetRules.length > 1)
			return (
				<p>
					<Trans i18nKey="clickForMore">
						Cliquez sur les lignes de résultat ci-dessus pour les comprendre
					</Trans>
				</p>
			)

		return <Rule rule={head(targetRules)} />
	}
}
