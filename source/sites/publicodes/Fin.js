import React from 'react'
import { useParams } from 'react-router'
import emoji from 'react-easy-emoji'
import tinygradient from 'tinygradient'
import { animated, useSpring, config } from 'react-spring'

const gradient = tinygradient([
		'#78e08f',
		'#f6b93b',
		'#b71540',
		'#e84393',
		'#8854d0',
		'#000000',
	]),
	colors = gradient.rgb(40)

const getBackgroundColor = (score) =>
	colors[
		Math.round((score < 2000 ? 0 : score > 30000 ? 29 : score - 2000) / 1000)
	]

export default ({}) => {
	const { score } = useParams()
	const { value } = useSpring({
		config: { mass: 1, tension: 100, friction: 220 },
		value: +score,
		from: { value: 0 },
	})

	return <AnimatedDiv value={value} score={score} />
}

const AnimatedDiv = animated(({ score, value }) => (
	<div
		className="ui__ full-width"
		css={`
			background: ${getBackgroundColor(value)};
			width: 100vw;
			height: 85vh;
			display: flex;
			flex-direction: column;
			justify-content: space-evenly;

			text-align: center;
			h1 {
				margin: 0.3rem;
			}
			font-size: 110%;
		`}
	>
		<h1>Mon empreinte sur le climat</h1>

		<div
			css={`
				> p:first-child {
					font-size: 250%;
				}
			`}
		>
			<p>
				<span css="width: 4.8rem; text-align: left; display: inline-block">
					{Math.round(value / 100) / 10}
				</span>{' '}
				tonnes
			</p>
			<p>Moyenne française {emoji('🇫🇷')} : 11 tonnes</p>
			<p>Objectif neutralité {emoji('😇')} : 2 tonnes</p>
		</div>
		<div
			css={`
				border: 2px dashed white;
				border-radius: 1rem;
				padding: 1rem;
				margin: 1rem;
				color: white;
			`}
		>
			{' '}
			Bientôt : des actions concrètes et chiffrées pour réduire votre empreinte
		</div>
	</div>
))
