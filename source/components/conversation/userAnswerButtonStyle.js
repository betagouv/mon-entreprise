
export let answered = ({colour, textColour}) => ({
	background: colour,
	border: '1px solid ' + colour,
	color: textColour,
})

export let answer = ({textColourOnWhite}) => ({
	color: textColourOnWhite,
	border: '1px solid ' + textColourOnWhite,
})
