/* @flow */

import withColours from 'Components/utils/withColours'
import marianneSvg from 'Images/marianne.svg'
import urssafSvg from 'Images/urssaf.svg'
import React from 'react'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'
import Footer from '../layout/Footer/Footer'
import './Landing.css'

const Landing = ({ colours: { colour } }) => (
	<>
		<header className="landing__header">
			<img alt="logo marianne" src={marianneSvg} />
			<img alt="logo urssaf" src={urssafSvg} />
		</header>
		<section className="landing__banner" style={{ backgroundColor: colour }}>
			<header>
				<h1>
					Start your business in France <br />
					{emoji('🇫🇷')}
				</h1>
				<p className="ui__ lead" style={{ maxWidth: '30rem' }}>
					The ultimate how-to guide, from incorporation to hiring.
				</p>
				<Link
					className="ui__ inverted-button"
					to="/company"
					alt="the first step to create a company">
					Get started
				</Link>
				<svg
					className="landing__banner__svg white"
					preserveAspectRatio="none"
					viewBox="5 0 495 150">
					<path fill="white" d="M 0 150 Q 150 0 500 0 L 500 150 Z" />
				</svg>
			</header>
		</section>
		<section className="landing-explanation">
			<div>
				<h2>Your new company </h2>
				<div className="landing-explanation-content">
					{emoji('🏗️')}
					<ul>
						<li>Find the type of company that suits you</li>
						<li>Follow the steps to register your company</li>
					</ul>
				</div>
				<p>
					<Link className="ui__ skip-button" to="/company">
						Create your company ›
					</Link>
				</p>
			</div>
			<div>
				<h2>The French social security</h2>
				<div className="landing-explanation-content">
					{emoji('💶')}
					<ul>
						<li>Discover the French social security system</li>
						<li>Simulate your hiring costs</li>
					</ul>
				</div>
				<p>
					<Link className="ui__ skip-button" to="/social-security">
						Simulate hiring costs and benefits ›
					</Link>
				</p>
			</div>
			<div>
				<h2>Your first employee</h2>
				<div className="landing-explanation-content">
					{emoji('🤝')}
					<ul>
						<li>Discover the procedures to hire in France</li>
						<li>Learn the basics of French labour law</li>
					</ul>
				</div>
				<p>
					<Link className="ui__ skip-button" to="/hiring-process">
						Discover the hiring process ›
					</Link>
				</p>
			</div>
		</section>
		<Footer />
	</>
)

export default withColours(Landing)
