import React from 'react'
import emoji from 'react-easy-emoji'
import { useSelector } from 'react-redux'

export default ({ nodeValue: possiblyNegativeValue }) => {
	const foldedSteps = useSelector(
			(state) => state.conversationSteps?.foldedSteps
		),
		simulationStarted = foldedSteps && foldedSteps.length
	let unitSuffix = (
			<span>
				de <strong>CO₂</strong>e par an
			</span>
		),
		v = Math.abs(possiblyNegativeValue),
		[raw, unit] =
			v === 0
				? [v, '']
				: v < 1
				? [v * 1000, 'g']
				: v < 1000
				? [v, 'kilos']
				: [v / 1000, 'tonnes'],
		value = raw.toFixed(1) * (possiblyNegativeValue < 0 ? -1 : 1)

	return (
		<span>
			{!simulationStarted ? (
				<em>{emoji('🇫🇷 ')} Un français émet en moyenne</em>
			) : (
				<em>Votre total provisoire</em>
			)}
			<div>
				<strong
					css={`
						font-size: 160%;
						font-weight: 600;
					`}
				>
					{value}&nbsp;{unit}
				</strong>{' '}
				{unitSuffix}
			</div>
		</span>
	)
}
