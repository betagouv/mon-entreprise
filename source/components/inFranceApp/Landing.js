/* @flow */

import React from 'react'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'
import { config } from 'react-spring'
import withColours from '../withColours'
import * as Animate from './animate'
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
					<h1>Launch your business in France</h1>
					<ul>
						<li>Incorporation guide {emoji('🏗️')}</li>
						<li>Costs and social benefits {emoji('💰')}</li>
						<li>Hiring your first employee {emoji('🤝')}</li>
					</ul>
					<Link
						className="ui__ inverted-button cta"
						to="/create-my-company"
						alt="the first step to create a company">
						Take the step by step guide
					</Link>
				</Animate.fromBottom>
			</header>
		</section>
		<section className="landing__explanations" />
		<section className="landing__nav" />
	</>
)

export default withColours(Landing)
