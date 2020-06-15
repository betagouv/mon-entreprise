import React from 'react'
import { useParams } from 'react-router'
import emoji from 'react-easy-emoji'
import tinygradient from 'tinygradient'
import { animated, useSpring, config } from 'react-spring'
import ShareButton from 'Components/ShareButton'
import { findContrastedTextColor } from 'Components/utils/colors'

const gradient = tinygradient([
		'#78e08f',
		'#e1d738',
		'#f6b93b',
		'#b71540',
		'#000000',
	]),
	colors = gradient.rgb(20)

const getBackgroundColor = (score) =>
	colors[
		Math.round((score < 2000 ? 0 : score > 20000 ? 19000 : score - 2000) / 1000)
	]

export default ({}) => {
	const { score } = useParams()
	const { value } = useSpring({
		config: { mass: 1, tension: 150, friction: 150 },
		value: +score,
		from: { value: 0 },
	})

	return <AnimatedDiv value={value} score={score} />
}

const AnimatedDiv = animated(({ score, value }) => {
	const backgroundColor = getBackgroundColor(value).toHexString(),
		a = console.log(typeof backgroundColor),
		textColor = findContrastedTextColor(backgroundColor, true)

	return (
		<div css="padding: 0 .3rem; max-width: 600px; margin: 0 auto;">
			<h1 css="margin: 0;font-size: 160%">Mon empreinte climat</h1>
			<div
				className=""
				css={`
					background: ${backgroundColor};
					color: ${textColor};
					margin: 0 auto;
					border-radius: 0.6rem;
					height: 65vh;
					display: flex;
					flex-direction: column;
					justify-content: space-evenly;

					text-align: center;
					font-size: 110%;
					> div > p {
						display: flex;
						justify-content: space-around;
					}
				`}
			>
				<p>
					<span css="font-weight: bold; font-size: 260%; margin-bottom: .3rem">
						<span css="width: 3.6rem; text-align: left; display: inline-block">
							{Math.round(value / 1000)}
						</span>{' '}
						tonnes
					</span>
				</p>
				<div>
					<p>
						<span>{emoji('🇫🇷 ')}</span>
						<span> Moyenne française</span> <span> 11 tonnes</span>
					</p>
					<p>
						<span>{emoji('😇 ')} </span>
						<span>Objectif neutralité</span>
						<span>2 tonnes</span>
					</p>
				</div>

				<div css="display: flex; flex-direction: column;">
					<ShareButton
						text="Mesure ton impact sur le simulateur Ecolab climat !"
						url={window.location}
						title={'Ecolab-climat'}
					/>
				</div>
			</div>
			<h2 css="margin: 1rem 0 .6rem;font-size: 120%">Que faire ?</h2>
			<div
				css={`
					border: 2px dashed black;
					border-radius: 0.6rem;
					padding: 1rem;
					margin: 0 auto;
				`}
			>
				{' '}
				Bientôt : des actions concrètes et chiffrées pour réduire votre
				empreinte
			</div>
		</div>
	)
})
