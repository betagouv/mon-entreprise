import findContrastedTextColour from './findContrastedTextColour'

export default forcedThemeColour => {
	let // Use the default theme colour if the host page hasn't made a choice
		defaultColour = '#2975D1',
		colour = forcedThemeColour || defaultColour,
		textColour = findContrastedTextColour(colour, true), // the 'simple' version feels better...
		inverseTextColour = textColour === '#ffffff' ? '#000' : '#fff',
		lightenTextColour = textColour =>
			textColour === '#ffffff' ? 'rgba(255, 255, 255, .85)' : '#333',
		lighterTextColour = lightenTextColour(textColour),
		lighterInverseTextColour = lightenTextColour(inverseTextColour),
		textColourOnWhite = textColour === '#ffffff' ? colour : '#333'

	return {
		colour,
		textColour,
		inverseTextColour,
		lighterTextColour,
		lighterInverseTextColour,
		textColourOnWhite
	}
}
