export default possiblyNegativeValue => {
	let unitSuffix = 'de CO₂- éq',
		v = Math.abs(possiblyNegativeValue),
		[raw, unit] =
			v === 0
				? [v, '']
				: v < 1
				? [v * 1000, 'g']
				: v < 1000
				? [v, 'kilos']
				: [v / 1000, 'tonnes']

	return [
		raw.toFixed(1) * (possiblyNegativeValue < 0 ? -1 : 1),
		unit + ' ' + unitSuffix
	]
}
