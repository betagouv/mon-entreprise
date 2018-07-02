/* @flow */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as Animate from '../../animate'
import type { ComponentType } from 'react'
type State = {
	simu: ?ComponentType<{}>
}

type Props = {
	hideText: boolean
}
class Hiring extends Component<Props, State> {
	state = { simu: null }
	componentDidMount() {
		import('../../../Simu').then(({ default: simu }) => this.setState({ simu }))
	}
	render() {
		const Simu = this.state.simu
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
							This easy access to health care and other services ensures that
							companies can put healthy, highly skilled, and productive
							employees to work in an attractive market in the heart of Europe.
						</p>
						<p>
							By paying in to this system, all of France’s 2.2 million
							companies, 3.2 million self-employed workers, and 25 million
							employees help to finance an all-included social insurance
							package.
						</p>
						<h2>How much does it cost ?</h2>
						<p>
							Explore the costs and benefits by entering a salary in the
							simulator below:
						</p>
					</>
				)}
				{Simu && <Simu />}
			</Animate.fromBottom>
		)
	}
}

export default connect(
	state => ({ hideText: state.conversationStarted }),
	{}
)(Hiring)
