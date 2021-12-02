export function hexToHSL(hex: string): [number, number, number] {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
	if (result === null) {
		throw new Error('Accept only hex strings')
	}
	let r = parseInt(result[1], 16)
	let g = parseInt(result[2], 16)
	let b = parseInt(result[3], 16)
	;(r /= 255), (g /= 255), (b /= 255)
	const max = Math.max(r, g, b),
		min = Math.min(r, g, b)
	let h = 0,
		s = 0
	const l = (max + min) / 2
	if (max != min) {
		const d = max - min
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0)
				break
			case g:
				h = (b - r) / d + 2
				break
			case b:
				h = (r - g) / d + 4
				break
		}
		h /= 6
	}
	return [h * 360, s * 100, l * 100].map(Math.round) as [number, number, number]
}
