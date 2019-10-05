import React from 'react'
export default ({ nodeValue: possiblyNegativeValue }) => {
	let unitSuffix = "d'équivalent CO₂",
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
			Soit{' '}
			<strong>
				{value}&nbsp;{unit}
			</strong>{' '}
			{unitSuffix}
		</span>
	)
}
