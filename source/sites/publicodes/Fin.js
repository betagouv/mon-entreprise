import React from 'react'
import { useParams } from 'react-router'
import emoji from 'react-easy-emoji'
import tinygradient from 'tinygradient'
import { animated, useSpring, config } from 'react-spring'
import ShareButton from 'Components/ShareButton'
import { findContrastedTextColor } from 'Components/utils/colors'
import { motion } from 'framer-motion'

import BallonGES from './images/ballonGES.svg'
import SessionBar from 'Components/SessionBar'

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
		config: { mass: 1, tension: 150, friction: 150, precision: 1000 },
		value: +score,
		from: { value: 0 },
	})

	return <AnimatedDiv value={value} score={score} />
}

const AnimatedDiv = animated(({ score, value }) => {
	const backgroundColor = getBackgroundColor(value).toHexString(),
		backgroundColor2 = getBackgroundColor(value + 2000).toHexString(),
		textColor = findContrastedTextColor(backgroundColor, true)

	return (
		<div css="padding: 0 .3rem; max-width: 600px; margin: 0 auto;">
			<SessionBar />
			<h1 css="margin: 0;font-size: 160%">Mon empreinte climat</h1>
			<motion.div
				animate={{ scale: [0.85, 1] }}
				transition={{ duration: 0.2, ease: 'easeIn' }}
				className=""
				css={`
					background: ${backgroundColor};
					background: linear-gradient(
						180deg,
						${backgroundColor} 0%,
						${backgroundColor2} 100%
					);
					color: ${textColor};
					margin: 0 auto;
					border-radius: 0.6rem;
					height: 60vh;
					display: flex;
					flex-direction: column;
					justify-content: space-evenly;

					text-align: center;
					font-size: 110%;
				`}
			>
				<p css="display: flex; align-items: center; justify-content: center">
					<img src={BallonGES} css="width: 8rem" />
					<span css="font-weight: bold; font-size: 260%; margin-bottom: .3rem">
						<span css="width: 3.6rem; text-align: right; display: inline-block">
							{Math.round(value / 1000)}
						</span>{' '}
						tonnes
					</span>
				</p>
				<div
					css={`
						background: #ffffff3d;
						width: 90%;
						border-radius: 0.6rem;
						margin: 0 auto;
						padding-top: 0.6rem;

						> p {
							display: flex;
							justify-content: space-around;
						}
					`}
				>
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
						color={textColor}
						label="Partager mes résultats"
					/>
				</div>
			</motion.div>
			<h2 css="margin: 1rem 0 .6rem;font-size: 120%">Que faire ?</h2>
			<div
				css={`
					border: 2px dashed black;
					border-radius: 0.6rem;
					padding: 1rem;
					margin: 0 auto;
					p {
						line-height: 1.1rem;
					}
					strong {
						font-weight: bold;
					}
				`}
			>
				{' '}
				<p>
					{emoji('👏')} Connaître son empreinte, c'est déjà un début de
					solution.
				</p>
				<p>
					<strong>Bientôt</strong>, des actions concrètes et chiffrées pour
					réduire votre empreinte.
				</p>
			</div>
		</div>
	)
})
