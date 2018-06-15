import React, { Component } from 'react'
import { Trans, translate } from 'react-i18next'
import './Explanation.css'
import withColours from './withColours'
import ResultView from './ResultView/ResultView'

@translate()
@withColours
export default class Explanation extends Component {
	render() {
		return (
			<section id="explanation">
				<ResultView />
				<div id="warning">
					<p>
						<i className="fa fa-info-circle" aria-hidden="true" />
						<Trans i18nKey="disclaimer">
							Le simulateur vous aide à comprendre votre bulletin de paie, sans
							lui être opposable. Il ne prend pour l'instant pas en compte les
							conventions et accords collectifs, ni la myriade d'aides à
							explorer sur
						</Trans>
						<a href="https://www.aides-entreprises.fr" target="_blank">
							{' '}
							aides-entreprises.fr
						</a>.
					</p>
				</div>
			</section>
		)
	}
}
