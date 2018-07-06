/* @flow */

import { compose } from 'ramda'
import React from 'react'
import { connect } from 'react-redux'
import { NavLink, withRouter } from 'react-router-dom'
import companySvg from './company.svg'
import estimateSvg from './estimate.svg'
import hiringSvg from './hiring.svg'
import selectors from './selectors'
import './StepsHeader.css'
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
	estimationProgress: number
}
const StepsHeader = ({ companyProgress, estimationProgress }: Props) => (
	<header className="ui__ steps-header container">
		<nav>
			<NavLink to="/my-company" activeClassName="active">
				<img src={companySvg} />
				<Progress percent={companyProgress} />
			</NavLink>
			<NavLink to="/social-security" activeClassName="active">
				<img src={estimateSvg} />
				<Progress percent={estimationProgress} />
			</NavLink>
			<NavLink to="/hiring-step-list" activeClassName="active">
				<img src={hiringSvg} />
				<Progress percent={40} />
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
