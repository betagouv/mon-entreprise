/* @flow */

import Simulateur from 'Components/Simu'
import { ScrollToTop } from 'Components/utils/Scroll'
import { compose } from 'ramda'
import React, { Component } from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import * as Animate from 'Ui/animate'

type Props = {
	hideText: boolean
}
class SocialSecurity extends Component<Props, {}> {
	render() {
		return (
			<>
				<Helmet>
					<title>Social security in France: costs and benefits</title>
					<meta
						name="description"
						content="France has chosen to provide its citizens with a high-quality
						social safety net. Discover the costs and benefits of French social security by simulating a concrete case of hiring in your company."
					/>
				</Helmet>
				<ScrollToTop />
				<Animate.fromBottom>
					{!this.props.hideText && (
						<>
							<h1>Social protection: costs and benefits</h1>
							<p>
								France has chosen to provide its citizens with a high-quality
								social safety net. This mandatory system is based on solidarity
								and designed to ensure the{' '}
								<strong>general welfare of its people</strong>.{' '}
							</p>
							<p>
								Easy access to health care and other services ensures that
								companies can put healthy, productive and highly skilled
								employees to work in an attractive market in the heart of
								Europe.
							</p>
							<p>
								As soon as you declare and pay your employees, you automatically
								entitle them to the general scheme of French Social Security
								(health, maternity, disability, old age, occupational illness
								and accidents) and unemployment insurance.
							</p>
							<div
								style={{
									position: 'relative',
									width: '100%',
									height: '0',
									paddingBottom: '56.25%'
								}}>
								<iframe
									style={{
										position: 'absolute',
										top: 0,
										left: 0,
										width: '100%',
										height: '100%'
									}}
									src="https://www.youtube-nocookie.com/embed/dN9ZVazSmpc?rel=0&amp;showinfo=0"
									frameBorder="0"
									allow="autoplay; encrypted-media"
									allowFullScreen
								/>
							</div>
							<h2>How much does it cost to hire ?</h2>
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
