import convert from 'color-convert'
import findContrastedTextColour from './findContrastedTextColour'
const lightenColour = (hex, x) => {
	const [h, s, l] = convert.hex.hsl(hex.split('#')[1])
	return '#' + convert.hsl.hex([h, s, Math.max(2, Math.min(l + x, 98))])
}
export default forcedThemeColour => {
	let // Use the default theme colour if the host page hasn't made a choice
		defaultColour = '#2975D1',
		colour = forcedThemeColour || defaultColour,
		lightColour = lightenColour(colour, 10),
		darkColour = lightenColour(colour, -10),
		lightestColour = lightenColour(colour, 100),
		darkestColour = lightenColour(colour, -100),
		textColour = findContrastedTextColour(colour, true), // the 'simple' version feels better...
		inverseTextColour = textColour === '#ffffff' ? '#000' : '#fff',
		lightenTextColour = textColour =>
			textColour === '#ffffff' ? 'rgba(255, 255, 255, .85)' : '#333',
		lighterTextColour = lightenTextColour(textColour),
		lighterInverseTextColour = lightenTextColour(inverseTextColour),
		textColourOnWhite = textColour === '#ffffff' ? colour : '#333'

	return {
		colour,
		lightenColour: amount => lightenColour(colour, amount),
		textColour,
		inverseTextColour,
		lighterTextColour,
		lighterInverseTextColour,
		textColourOnWhite,
		lightColour,
		darkColour,
		lightestColour,
		darkestColour
	}
}
