import React from 'react'
import { useLocation } from 'react-router'
import emoji from 'react-easy-emoji'
import tinygradient from 'tinygradient'
import { animated, useSpring } from 'react-spring'
import ShareButton from 'Components/ShareButton'
import { findContrastedTextColor } from 'Components/utils/colors'
import { motion } from 'framer-motion'

import BallonGES from './images/ballonGES.svg'
import SessionBar from 'Components/SessionBar'
import Chart from './chart'

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
	const query = new URLSearchParams(useLocation().search),
		score = query.get('total'),
		// details=a2.6t2.1s1.3l1.0b0.8f0.2n0.1
		encodedDetails = query.get('details'),
		rehydratedDetails = Object.fromEntries(
			encodedDetails
				.match(/.{1,4}/g)
				.map(([category, ...rest]) => [category, 1000 * +rest.join('')])
		)
	const { value } = useSpring({
		config: { mass: 1, tension: 150, friction: 150, precision: 1000 },
		value: +score,
		from: { value: 0 },
	})

	return <AnimatedDiv value={value} score={score} details={rehydratedDetails} />
}

const AnimatedDiv = animated(({ score, value, details }) => {
	const backgroundColor = getBackgroundColor(value).toHexString(),
		backgroundColor2 = getBackgroundColor(value + 2000).toHexString(),
		textColor = findContrastedTextColor(backgroundColor, true)

	return (
		<div css="padding: 0 .3rem 1rem; max-width: 600px; margin: 0 auto;">
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
				<div css="display: flex; align-items: center; justify-content: center">
					<img src={BallonGES} css="width: 30%" />
					<div>
						<div css="font-weight: bold; font-size: 280%; margin-bottom: .3rem">
							<span css="width: 3.6rem; text-align: right; display: inline-block">
								{Math.round(value / 1000)}
							</span>{' '}
							tonnes
						</div>
						<div
							css={`
								background: #ffffff3d;
								border-radius: 0.6rem;
								margin: 0 auto;
								padding: 0.4rem 1rem;

								> div {
									display: flex;
									justify-content: space-between;
									flex-wrap: wrap;
								}
								strong {
									font-weight: bold;
								}
								> img {
									margin: 0 0.6rem !important;
								}
							`}
						>
							<div>
								<span>
									{emoji('🇫🇷 ')}
									moyenne{' '}
								</span>{' '}
								<strong> 11 tonnes</strong>
							</div>
							<div>
								<span>
									{emoji('😇 ')}
									objectif{' '}
								</span>
								<strong>2 tonnes</strong>
							</div>
							<div css="margin-top: .4rem;justify-content: flex-end !important">
								<a
									css="color: inherit"
									href="https://ecolab.ademe.fr/blog/général/budget-empreinte-carbone-c-est-quoi.md"
								>
									Comment ça ?
								</a>
							</div>
						</div>
					</div>
				</div>
				<Chart details={details} noText />

				<div css="display: flex; flex-direction: column;">
					<ShareButton
						text="Mesure ton impact sur le simulateur Ecolab cliat !"
						url={window.location}
						title={'Ecolab climat'}
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
