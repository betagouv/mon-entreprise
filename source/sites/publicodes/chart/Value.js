import React from 'react'

const humanWeightUnit = (v) =>
	v === 0
		? [v, '']
		: v < 1
		? [v * 1000, 'g']
		: v < 1000
		? [v, 'kg']
		: [v / 1000, 't']

export default ({ nodeValue, color }) => {
	const [value, unit] = humanWeightUnit(nodeValue)
	return (
		<span
			css={`
				color: ${color || 'var(--textColorOnWhite)'};
				font-weight: 600;
				vertical-align: baseline;
			`}
		>
			{value < 10 ? value.toFixed(1) : Math.round(value)}&nbsp;{unit}
		</span>
	)
}
