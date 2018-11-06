/* @flow */

import withTracker from 'Components/utils/withTracker'
import { compose } from 'ramda'
import { React, T } from 'Components'
import { connect } from 'react-redux'
import { NavLink, withRouter } from 'react-router-dom'
import selectors from 'Selectors/progressSelectors'
import companySvg from '../../images/company.svg'
import estimateSvg from '../../images/estimate.svg'
import hiringSvg from '../../images/hiring.svg'
import './ProgressHeader.css'
import type { Tracker } from 'Components/utils/withTracker'
import { translate } from 'react-i18next'

const Progress = ({ percent }) => (
	<div className="progress">
		<div
			className="bar"
			style={{
				width: `${percent}%`
			}}
		/>
	</div>
)
type Props = {
	companyProgress: number,
	estimationProgress: number,
	hiringProgress: number,
	tracker: Tracker
}
const StepsHeader = ({
	companyProgress,
	estimationProgress,
	hiringProgress,
	tracker
}: Props) => (
	<header className="steps-header">
		<nav className="ui__ container">
			<NavLink
				to="/company"
				activeClassName="active"
				onClick={() =>
					tracker.push(['trackEvent', 'Header', 'click', 'Your company'])
				}>
				<img src={companySvg} />
				<div>
					<T>Votre entreprise</T>
				</div>
				<Progress percent={companyProgress} />
			</NavLink>
			<NavLink
				to="/social-security"
				activeClassName="active"
				onClick={() =>
					tracker.push(['trackEvent', 'Header', 'click', 'Social security'])
				}>
				<img src={estimateSvg} />
				<div>
					<T>Protection sociale</T>
				</div>

				<Progress percent={estimationProgress} />
			</NavLink>
			<NavLink
				to="/hiring-process"
				activeClassName="active"
				onClick={() =>
					tracker.push(['trackEvent', 'Header', 'click', 'Hiring process'])
				}>
				<img src={hiringSvg} />
				<div>
					<T>Embaucher</T>
				</div>

				<Progress percent={hiringProgress} />
			</NavLink>
		</nav>
	</header>
)

export default compose(
	withRouter,
	withTracker,
	connect(
		selectors,
		{}
	),
	translate()
)(StepsHeader)
