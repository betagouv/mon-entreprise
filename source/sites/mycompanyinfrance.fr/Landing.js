/* @flow */

import withColours from 'Components/utils/withColours'
import marianneSvg from 'Images/marianne.svg'
import urssafSvg from 'Images/urssaf.svg'
import React from 'react'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'
import './Landing.css'

const Landing = ({ colours: { colour } }) => (
	<>
		<section className="landing__header" style={{ backgroundColor: colour }}>
			<div className="landing__banner">
				<img alt="logo marianne" src={marianneSvg} />
				<img alt="logo urssaf" src={urssafSvg} />
			</div>
			<header>
				<h1>Start your business in France</h1>
				<Link
					className="ui__ inverted-button cta"
					to="/company"
					alt="the first step to create a company">
					Take the step by step guide
				</Link>
			</header>
		</section>
		<section className="landing-explanation">
			<div>
				<h2>Your new company </h2>
				<div className="landing-explanation-content">
					{emoji('🏗️')}
					<ul>
						<li>Find the type of company that suits you</li>
						<li>Choose the best location for your business</li>
						<li>Follow the steps to register your company</li>
					</ul>
				</div>
				<p>
					<Link to="/company">Create your company</Link>
				</p>
			</div>
			<div>
				<h2>The French social security</h2>
				<div className="landing-explanation-content">
					{emoji('💶')}
					<ul>
						<li>Discover the French social security system</li>
						<li>Simulate your hiring costs </li>
						<li>Understand the French payslip</li>
					</ul>
				</div>
				<p>
					<Link to="/social-security">Simulate hiring costs and benefits</Link>
				</p>
			</div>
			<div>
				<h2>Your first employee</h2>
				<div className="landing-explanation-content">
					{emoji('🤝')}
					<ul>
						<li>Discover the procedures to hire in France</li>
						<li>Learn the basics of French labour law</li>
						<li>Find the right tool to make a payslip</li>
					</ul>
				</div>
				<p>
					<Link to="/hiring-process">Discover the hiring process</Link>
				</p>
			</div>
		</section>
		<section className="landing__nav" />
	</>
)

export default withColours(Landing)
