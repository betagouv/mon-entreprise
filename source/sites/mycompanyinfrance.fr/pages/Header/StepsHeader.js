/* @flow */

import { compose } from 'ramda'
import React from 'react'
import { connect } from 'react-redux'
import { NavLink, withRouter } from 'react-router-dom'
import selectors from 'Selectors/headerProgressSelectors'
import companySvg from './company.svg'
import estimateSvg from './estimate.svg'
import hiringSvg from './hiring.svg'
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
	<header className="steps-header ui__ container">
		<nav>
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
				<Progress percent={0} />
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
