/* @flow */

import React, { Component } from 'react'
import type { ComponentType } from 'react'

type State = {
	simu: ?ComponentType<{}>
}

class Hiring extends Component<{}, State> {
	state = { simu: null }
	componentDidMount() {
		import('../../../Simu').then(({ default: simu }) => this.setState({ simu }))
	}
	render() {
		const Simu = this.state.simu
		return (
			<fromBottom>
				<h1>Hiring and social security</h1>
				<p>
					France has chosen to provide its citizens with a high-level social
					safety net. This mandatory system is based on solidarity and designed
					to ensure the general welfare of its people. All the benefits are
					included in the Social Security charges as standard.
				</p>
				<p>
					This easy access to health care and other services ensures that
					companies can put healthy, highly skilled, and productive employees to
					work in an attractive market in the heart of Europe.
				</p>
				<p>
					By paying in to this system, all of France’s 2.2 million companies,
					3.2 million self-employed workers, and 25 million employees help to
					finance an all-included social insurance package.
				</p>
				<h2>How much does it cost ?</h2>
				<p>
					Explore the costs and benefits by entering a salary in the simulator
					below:
				</p>
				{Simu && <Simu />}
			</fromBottom>
		)
	}
}

export default Hiring
