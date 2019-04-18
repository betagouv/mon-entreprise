/* @flow */

import React from 'react'
import emoji from 'react-easy-emoji'
import { connect } from 'react-redux'
import Animate from 'Ui/animate'
import './Banner.css'
import type { Node } from 'react'
import type { State } from 'Types/State'
type PropTypes = {
	hidden: boolean,
	children: Node,
	icon?: String
}

let Banner = ({ hidden = false, children, icon }: PropTypes) =>
	!hidden ? (
		<Animate.fadeIn>
			<div className="ui__ banner">
				{icon && emoji(icon)}
				<p>{children}</p>
			</div>
		</Animate.fadeIn>
	) : null

export default (connect(
	(state: State, { hidden }: PropTypes) => ({
		hidden: hidden || state.conversationStarted
	}),
	{}
)(Banner): React$ComponentType<PropTypes>)
