/* @flow */

import React from 'react'
import { config } from 'react-spring'
import withColours from '../withColours'
import * as Animate from './animate'
import './Landing.css'
import marianneSvg from './marianne.svg'
import urssafSvg from './urssaf.svg'
import emoji from 'react-easy-emoji'

const Landing = ({ colours: { colour } }) => (
	<>
		<section className="landing__header" style={{ backgroundColor: colour }}>
			<header>
				<Animate.fromBottom config={config.slow}>
					<h1>Launch your business in France</h1>
					<ul>
						<li>Incorporation guide {emoji('🏗️🏢')}</li>
						<li>Costs and social benefits {emoji('💰')}</li>
						<li>Hiring your first employee {emoji('🤝')}</li>
					</ul>
					<a
						className="ui__ inverted-button cta"
						href="/create-my-company"
						alt="the first step to create a company">
						Take the step by step guide
					</a>
				</Animate.fromBottom>
			</header>
		</section>
		<section className="landing__reassurance">
			<div>
				<img alt="logo urssaf" src={urssafSvg} />
			</div>
			<div>
				<img alt="logo marianne" src={marianneSvg} />
			</div>
		</section>
		<section className="landing__explanations" />
		<section className="landing__nav" />
	</>
)

export default withColours(Landing)
