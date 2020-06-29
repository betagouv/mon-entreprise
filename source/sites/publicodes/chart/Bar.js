import React from 'react'
import { shadowStyle } from '../styles'
import Value from './Value'
import emoji from 'react-easy-emoji'

export default ({
	couleur,
	nodeValue,
	icônes = '🌍',
	title,
	empreinteMaximum,
	noText,
	color,
}) => (
	<>
		{!noText && (
			<div css="color: var(--textColorOnWhite)">
				<span>{title}</span>
			</div>
		)}
		<div
			css={`
				display: flex;
				align-items: center;
				height: 1rem;
			`}
		>
			<span
				css={`
					font-size: 140%;
					width: 2.3rem;
					margin-left: -2.3rem;
				`}
			>
				{emoji(icônes)}
			</span>
			<span
				css={`
					display: inline-block;
					background: ${couleur};
					margin-top: 0rem;
					margin-right: 0.8rem;
					height: 1.1rem;
					padding-left: 0.1rem;
					border-radius: 0.4rem;
					width: ${(nodeValue / empreinteMaximum) * 100 * 0.9}%;
					color: white;
					${shadowStyle}
				`}
			></span>
			<Value {...{ color, nodeValue }} />
		</div>
	</>
)
export const capitalizeFirst = (text) =>
	text[0].toUpperCase() + text.slice(1, text.length)
