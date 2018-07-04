/* @flow */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Simu from '../../../Simu'
import * as Animate from '../../animate'

type Props = {
	hideText: boolean
}
class Hiring extends Component<Props, State> {
	render() {
		return (
			<Animate.fromBottom>
				{!this.props.hideText && (
					<>
						<h1>Hiring and social security</h1>
						<p>
							France has chosen to provide its citizens with a high-level social
							safety net. This mandatory system is based on solidarity and
							designed to ensure the general welfare of its people. All the
							benefits are included in the Social Security charges as standard.
						</p>
						<p>
							By paying in to this system, all of France’s 2.2 million
							companies, 3.3 million self-employed workers, and 25 million
							employees help to finance the Social Security system
						</p>
						<p>
							As soon as you declare and pay your employees, you automatically
							entitle them to all of France’s health, maternity, disability, old
							age, unemployment, occupational accidents and occupational illness
							insurance programs.
						</p>
						<h2>How much does it cost ?</h2>
					</>
				)}
				<Simu />
			</Animate.fromBottom>
		)
	}
}

export default connect(
	state => ({ hideText: state.conversationStarted }),
	{}
)(Hiring)
