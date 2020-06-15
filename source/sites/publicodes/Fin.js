import React from 'react'
import { useParams } from 'react-router'
import emoji from 'react-easy-emoji'
import tinygradient from 'tinygradient'
import { animated, useSpring, config } from 'react-spring'
import ShareButton from 'Components/ShareButton'

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
	<>
		<h1 css="margin: 0 .6rem;font-size: 160%">Mon empreinte climat</h1>
		<div
			className=""
			css={`
				background: ${getBackgroundColor(value)};
				margin: 0 auto;
				border-radius: 1rem;
				width: 92vw;
				height: 70vh;
				display: flex;
				flex-direction: column;
				justify-content: space-evenly;

				text-align: center;
				font-size: 110%;
			`}
		>
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

			<div css="display: flex; flex-direction: column;">
				<ShareButton
					text="Mesure ton impact sur le simulateur Ecolab climat !"
					url={window.location}
					title={'Ecolab-climat'}
				/>
				Partager
			</div>
		</div>
		<div
			css={`
				border: 2px dashed black;
				border-radius: 1rem;
				padding: 1rem;
				margin: 1rem;
			`}
		>
			{' '}
			Bientôt : des actions concrètes et chiffrées pour réduire votre empreinte
		</div>
	</>
))
