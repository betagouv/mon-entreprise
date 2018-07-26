/* @flow */

import withColours from 'Components/utils/withColours'
import React from 'react'
import { Link } from 'react-router-dom'
import { config } from 'react-spring'
import * as Animate from 'Ui/animate'
import './Landing.css'
import marianneSvg from './marianne.svg'
import urssafSvg from './urssaf.svg'

const Landing = ({ colours: { colour } }) => (
	<>
		<section className="landing__header" style={{ backgroundColor: colour }}>
			<div className="landing__banner">
				<img alt="logo urssaf" src={urssafSvg} />
				<img alt="logo marianne" src={marianneSvg} />
			</div>
			<header>
				<Animate.fromBottom delay={500} config={config.slow}>
					<h1>
						Start your business in France.{' '}
						<span
							style={{
								// color: '#e2011c'
								fontWeight: 200
							}}>
							No hassle.
						</span>
					</h1>
					<Link
						className="ui__ inverted-button cta"
						to="/register"
						alt="the first step to create a company">
						Take the step by step guide
					</Link>
				</Animate.fromBottom>
			</header>
		</section>
		<section className="ui__ container landing-explanation">
			<h2>1. Create your company</h2>
			<p>
				Find the legal status that suits you in one minute. Choose the best
				location for your location. Let us guide you through the different steps
				up to the registration of your company.
			</p>

			<h2>2. Simulate costs and social benefits</h2>
			<p>
				Discover French social security. Find out about benefits and what is
				covered. Simulate the contribution amount for all policy types. Navigate
				between the different sections of a pay slip. Create your hiring project
				from A to Z.
			</p>
			<h2>3. Hire your first employee</h2>
			<p>
				See the hiring procedures in France. Learn the basics of french labour
				law. Write an employment contract. Know the different tools for editing
				a compliant payslip.
			</p>
		</section>
		<section className="landing__nav" />
	</>
)

export default withColours(Landing)
