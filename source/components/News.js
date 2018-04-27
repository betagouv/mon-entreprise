import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'ramda'
import withColours from './withColours'
import { Trans, translate } from 'react-i18next'
import './News.css'

let News = ({ hidden, colours: { textColourOnWhite } }) =>
	!hidden ? (
		<div className="news-header">
			<i
				className="fa fa-newspaper-o"
				aria-hidden="true"
				style={{
					color: textColourOnWhite
				}}
			/>
			<p>
				<Trans i18nKey="news">
					Le simulateur vous propose désormais une estimation instantanée !
				</Trans>
			</p>
		</div>
	) : null

export default compose(
	withColours,
	translate(),
	connect(state => ({
		hidden: state.conversationStarted
	}))
)(News)
