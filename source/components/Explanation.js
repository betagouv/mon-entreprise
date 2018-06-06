import { path } from 'ramda'
import React, { Component } from 'react'
import { Trans, translate } from 'react-i18next'
import { connect } from 'react-redux'
import './Explanation.css'
import ResultView from './ResultView/ResultView'
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
				<>
					<SearchButton />
					<ResultView />
				</>
				<div id="warning">
					<p>
						<i className="fa fa-info-circle" aria-hidden="true" />
						<Trans i18nKey="disclaimer">
							Le simulateur vous aide à comprendre votre bulletin de paie, sans
							lui être opposable. Il ne prend pour l&apos;instant pas en compte
							les conventions et accords collectifs, ni la myriade d&apos;aides
							à explorer sur
						</Trans>
						<a href="https://www.aides-entreprises.fr">aides-entreprises.fr</a>.
					</p>
				</div>
			</section>
		)
	}
}
