/* @flow */

import { compose } from 'ramda'
import React from 'react'
import { connect } from 'react-redux'
import { NavLink, withRouter } from 'react-router-dom'
import selectors from 'Selectors/progressSelectors'
import companySvg from './company.svg'
import estimateSvg from './estimate.svg'
import hiringSvg from './hiring.svg'
import './ProgressHeader.css'
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
	hiringProgress: number
}
const StepsHeader = ({
	companyProgress,
	estimationProgress,
	hiringProgress
}: Props) => (
	<header className="steps-header">
		<nav className="ui__ container">
			<NavLink to="/company" activeClassName="active">
				<img src={companySvg} />
				<div>Your company</div>
				<Progress percent={companyProgress} />
			</NavLink>
			<NavLink exact to="/social-security" activeClassName="active">
				<img src={estimateSvg} />
				<div>Social security</div>
				<Progress percent={estimationProgress} />
			</NavLink>
			<NavLink to="/hiring-process" activeClassName="active">
				<img src={hiringSvg} />
				<div>Hiring process</div>
				<Progress percent={hiringProgress} />
			</NavLink>
		</nav>
	</header>
)

export default compose(
	withRouter,
	connect(
		selectors,
		{}
	)
)(StepsHeader)
