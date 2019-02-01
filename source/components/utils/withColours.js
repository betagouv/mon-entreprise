/* @flow */

import convert from 'color-convert'
import React, { Component, createContext } from 'react'
import type { ComponentType } from 'react'

export type ThemeColours = {
	colour: string,
	textColour: string,
	inverseTextColour: string,
	lighterTextColour: string,
	lighterInverseTextColour: string,
	textColourOnWhite: string,
	grayColour: string,
	darkColour: string,
	lightColour: string,
	lighterColour: string,
	lightestColour: string,
	darkestColour: string
}

/*
	Hex to RGB conversion:
 	http://www.javascripter.net/faq/hextorgb.htm
*/
let cutHex = h => (h.charAt(0) == '#' ? h.substring(1, 7) : h),
	hexToR = h => parseInt(cutHex(h).substring(0, 2), 16),
	hexToG = h => parseInt(cutHex(h).substring(2, 4), 16),
	hexToB = h => parseInt(cutHex(h).substring(4, 6), 16)

/*
	Given a background color, should you write on it in black or white ?
   	Taken from http://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color#comment61936401_3943023
*/
function findContrastedTextColour(color, simple) {
	let r = hexToR(color),
		g = hexToG(color),
		b = hexToB(color)

	if (simple) {
		// The YIQ formula
		return r * 0.299 + g * 0.587 + b * 0.114 > 128 ? '#000000' : '#ffffff'
	} // else complex formula
	let uicolors = [r / 255, g / 255, b / 255],
		c = uicolors.map(c =>
			c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
		),
		L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]

	return L > 0.179 ? '#000000' : '#ffffff'
}

const lightenColour = (hex, x) => {
	const [h, s, l] = convert.hex.hsl(hex.split('#')[1])
	return '#' + convert.hsl.hex([h, s, Math.max(2, Math.min(l + x, 98))])
}
const generateTheme = (themeColour?: ?string): ThemeColours => {
	let // Use the default theme colour if the host page hasn't made a choice
		colour = themeColour || '#2975D1',
		lightColour = lightenColour(colour, 10),
		darkColour = lightenColour(colour, -10),
		lighterColour = lightenColour(colour, 45),
		lightestColour = lightenColour(colour, 100),
		darkestColour = lightenColour(colour, -100),
		grayColour = '#00000099',
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
		textColourOnWhite,
		grayColour,
		darkColour,
		lightColour,
		lighterColour,
		lightestColour,
		darkestColour
	}
}

const ThemeColoursContext: React$Context<ThemeColours> = createContext(
	generateTheme()
)

type ProviderProps = {
	colour: string
}
export const ThemeColoursProvider = ({ colour, ...props }: ProviderProps) => (
	<ThemeColoursContext.Provider value={generateTheme(colour)} {...props} />
)
export default function withThemeColours<Props: { colours: ThemeColours }>(
	WrappedComponent: React$ComponentType<Props>
): React$ComponentType<$Diff<Props, { colours: ThemeColours }>> {
	class WithThemeColours extends Component<
		$Diff<Props, { colours: ThemeColours }>
	> {
		displayName = `withThemeColours(${WrappedComponent.displayName || ''})`
		render() {
			return (
				<ThemeColoursContext.Consumer>
					{colours => <WrappedComponent {...this.props} colours={colours} />}
				</ThemeColoursContext.Consumer>
			)
		}
	}
	return WithThemeColours
}
