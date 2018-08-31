/* @flow */
import { compose } from 'ramda'
import React, { Component } from 'react'
import Loadable from 'react-loadable'
import { connect } from 'react-redux'
import * as Animate from 'Ui/animate'

const Simulateur = Loadable({
	loader: () => import('Components/Simu'),
	loading() {
		return null
	}
})

type Props = {
	hideText: boolean
}

class SocialSecurity extends Component<Props, {}> {
	render() {
		return (
			<>
				<Animate.fromBottom>
					{!this.props.hideText && (
						<>
							<h1>Social protection: costs and benefits</h1>
							<p>
								France has chosen to provide its citizens with a high-quality
								social safety net. This mandatory system is based on solidarity
								and designed to ensure the{' '}
								<strong>general welfare of its people</strong>.
							</p>
							<p>
								This easy access to health care and other services ensures that
								companies can put healthy, highly skilled, and productive
								employees to work in an attractive market in the heart of
								Europe.
							</p>
							<p>
								As soon as you declare and pay your employees, you automatically
								entitle them to the general scheme of French Social Security
								(health, maternity, disability, old age, occupational illness,
								accident at work) and unemployment insurance.
							</p>
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<iframe
									style={{ margin: 'auto' }}
									width="560"
									height="315"
									src="https://www.youtube-nocookie.com/embed/dN9ZVazSmpc?rel=0&amp;showinfo=0"
									frameBorder="0"
									allow="autoplay; encrypted-media"
									allowFullScreen
								/>
							</div>
							<h2>How much does it cost ?</h2>
						</>
					)}
					<Simulateur displayHiringProcedures />
				</Animate.fromBottom>
			</>
		)
	}
}

export default compose(
	connect(
		state => ({ hideText: state.conversationStarted }),
		{}
	)
)(SocialSecurity)
