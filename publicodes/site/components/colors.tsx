import convert from 'color-convert'
import React, { createContext, useEffect, useRef } from 'react'

/*
	Hex to RGB conversion:
 	http://www.javascripter.net/faq/hextorgb.htm
*/
const cutHex = (h: string) => (h.startsWith('#') ? h.substring(1, 7) : h),
	hexToR = (h: string) => parseInt(cutHex(h).substring(0, 2), 16),
	hexToG = (h: string) => parseInt(cutHex(h).substring(2, 4), 16),
	hexToB = (h: string) => parseInt(cutHex(h).substring(4, 6), 16)

/*
	Given a background color, should you write on it in black or white ?
   	Taken from http://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color#comment61936401_3943023
*/
function findContrastedTextColor(color: string, simple: boolean) {
	const r = hexToR(color),
		g = hexToG(color),
		b = hexToB(color)

	if (simple) {
		// The YIQ formula
		return r * 0.299 + g * 0.587 + b * 0.114 > 128 ? '#000000' : '#ffffff'
	} // else complex formula
	const uicolors = [r / 255, g / 255, b / 255],
		c = uicolors.map((c) =>
			c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
		),
		L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]

	return L > 0.179 ? '#000000' : '#ffffff'
}

const lightenColor = (hex: string, x: number) => {
	const [h, s, l] = convert.hex.hsl(hex.split('#')[1])
	return '#' + convert.hsl.hex([h, s, Math.max(2, Math.min(l + x, 98))])
}

const generateDarkenVariations = (
	numberOfVariation: number,
	[h, s, l]: [number, number, number]
) => {
	return [...Array(numberOfVariation).keys()].map(
		(i) => '#' + convert.hsl.hex([h, s, l * 0.8 ** i])
	)
}

const deriveAnalogousPalettes = (hex: string) => {
	const [h, s, l] = convert.hex.hsl(hex.split('#')[1])
	return [
		generateDarkenVariations(4, [(h - 45) % 360, 0.75 * s, l]),
		generateDarkenVariations(4, [(h + 45) % 360, 0.75 * s, l]),
		generateDarkenVariations(4, [(h + 90) % 360, 0.75 * s, l]),
	]
}

const generateTheme = (themeColor?: string) => {
	const // Use the default theme color if the host page hasn't made a choice
		color = themeColor || '#2975D1',
		lightColor = lightenColor(color, 10),
		darkColor = lightenColor(color, -20),
		lighterColor = lightenColor(color, 45),
		lightestColor = lightenColor(color, 100),
		darkestColor = lightenColor(color, -100),
		grayColor = '#00000099',
		textColor = findContrastedTextColor(color, true), // the 'simple' version feels better...
		inverseTextColor = textColor === '#ffffff' ? '#000' : '#fff',
		lightenTextColor = (textColor: string) =>
			textColor === '#ffffff' ? 'rgba(255, 255, 255, .7)' : 'rgba(0, 0, 0, .7)',
		lighterTextColor = darkColor + 'cc',
		lighterInverseTextColor = lightenTextColor(inverseTextColor),
		textColorOnWhite = textColor === '#ffffff' ? color : '#333',
		palettes = deriveAnalogousPalettes(color)

	return {
		color,
		textColor,
		inverseTextColor,
		lighterTextColor,
		lighterInverseTextColor,
		textColorOnWhite,
		grayColor,
		darkColor,
		lightColor,
		lighterColor,
		lightestColor,
		darkestColor,
		palettes,
	}
}

export type ThemeColors = ReturnType<typeof generateTheme>

export const ThemeColorsContext = createContext<ThemeColors>(generateTheme())

type ProviderProps = {
	color?: string
	children: React.ReactNode
}

export function ThemeColorsProvider({ color, children }: ProviderProps) {
	const colors = generateTheme(color)
	const divRef = useRef<HTMLDivElement>(null)
	useEffect(() => {
		Object.entries(colors).forEach(([key, value]) => {
			if (typeof value === 'string') {
				divRef.current?.style.setProperty(`--${key}`, value)
			}
		}, colors)
	}, [colors])
	return (
		<ThemeColorsContext.Provider value={colors}>
			{/* This div is only used to set the CSS variables */}
			<div
				ref={divRef}
				css={`
					height: 100%;
					display: flex;
					flex-direction: column;
				`}
			>
				{children}
			</div>
		</ThemeColorsContext.Provider>
	)
}
