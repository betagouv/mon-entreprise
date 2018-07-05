import React from 'react'
import { NavLink } from 'react-router-dom'
import './StepsHeader.css'
import hiringSvg from './hiring.svg';
import companySvg from './company.svg';
import estimateSvg from './estimate.svg';
const Progress = ({ percent}) => <div className="progress"><div className="bar" style={{
	width: `${percent}%`
}}/></div>

const StepsHeader = () => (
	<header className="ui__ steps-header container"><nav>
		<NavLink to="/create-my-company" activeClassName="active">
			<img src={companySvg}/>
			<Progress percent={80}/>
		</NavLink>
		<NavLink to="/hiring-and-social-security" activeClassName="active">
			<img src={estimateSvg}/>
			<Progress percent={20}/>
		</NavLink>
		<NavLink to="/hiring-step-list" activeClassName="active">
			<img src={hiringSvg}/>
			<Progress percent={40}/>
		</NavLink></nav>
	</header>
)

export default StepsHeader
