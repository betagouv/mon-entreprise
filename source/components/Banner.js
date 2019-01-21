/* @flow */

import React from 'react'
import { connect } from 'react-redux'
import './Banner.css'
import type { Node } from 'react'
import type { State } from 'Types/State'

type PropTypes = {
	hidden: boolean,
	children: Node
}

let Banner = ({ hidden = false, children }: PropTypes) =>
	!hidden ? (
		<div className="banner">
			<p>{children}</p>
		</div>
	) : null

export default connect(
	(state: State, { hidden }: PropTypes) => ({
		hidden: hidden || state.conversationStarted
	}),
	{}
)(Banner)
