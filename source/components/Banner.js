/* @flow */

import React from 'react'
import type { Node } from 'react'
import { connect } from 'react-redux'
import { compose } from 'ramda'
import withColours from './withColours'
import './Banner.css'
import type { State } from '../types/State'

type PropTypes = {
	hidden: boolean,
	fontAwesomeIcon: string,
	children: Node
}

type ConnectedPropTypes = PropTypes & {
	colours: { textColourOnWhite: string }
}

let Banner = ({
	hidden,
	fontAwesomeIcon,
	colours: { textColourOnWhite },
	children
}: ConnectedPropTypes) =>
	!hidden ? (
		<div className="banner">
			<i
				className={`fa fa-${fontAwesomeIcon}`}
				aria-hidden="true"
				style={{
					color: textColourOnWhite
				}}
			/>
			<p>{children}</p>
		</div>
	) : null

export default compose(
	withColours,
	connect(
		(state: State, { hidden }: PropTypes) => ({
			hidden: hidden || state.conversationStarted
		}),
		{}
	)
)(Banner)
