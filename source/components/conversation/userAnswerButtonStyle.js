export let answered = ({ colour, textColour }) => ({
	background: colour,
	border: '1px solid ' + colour,
	color: textColour
})

export let answer = ({ colour, textColourOnWhite }) => ({
	border: '1px solid ' + colour,
	color: textColourOnWhite
})
