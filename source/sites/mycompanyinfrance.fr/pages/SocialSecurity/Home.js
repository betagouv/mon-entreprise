/* @flow */

import Simulateur from 'Components/Simu'
import { ScrollToTop } from 'Components/utils/Scroll'
import React, { Component } from 'react'
import Helmet from 'react-helmet'
import * as Animate from 'Ui/animate'
import type { Match, Location } from 'react-router'

type Props = {
	match: Match,
	location: Location
}
class SocialSecurity extends Component<Props, {}> {
	render() {
		return (
			<>
				<Helmet>
					<title>Social security in France: costs and benefits</title>
					<meta
						name="description"
						content="Discover the costs and benefits of French social security and protection (welfare) by simulating a concrete case of hiring in your company."
					/>
				</Helmet>
				<ScrollToTop />
				<Animate.fromBottom>
					{this.props.match.isExact && (
						<>
							<h1>Social protection: costs and benefits</h1>
							<p>
								La France a choisi d'offrir à ses citoyens une protection
								sociale de qualité. Ce système obligatoire repose sur la
								solidarité et vise à assurer le{' '}
								<strong>bien-être général de la population</strong>.
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
					<Simulateur displayHiringProcedures key={location.pathname} />
				</Animate.fromBottom>
			</>
		)
	}
}

export default SocialSecurity
