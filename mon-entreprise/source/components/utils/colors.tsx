import convert from 'color-convert'
import React, { createContext, useContext, useEffect, useRef } from 'react'
import HSL from './color/HSL';
import HSLInterface from './color/HSLInterface';

const BLACK = new HSL();
const WHITE = new HSL([0, 0, 1]);
const DEFAULT_COLOR = new HSL([212.857, 0.672, 0.49]);

/**
 * Given a background color, should you write on it in black or white ?
 * Taken from http://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color#comment61936401_3943023
 * @param {HSLInterface} color : base color;
 * @param {boolean} simple 
 * @returns 
 */
function findContrastedTextColor(color: HSLInterface): HSLInterface {
	const rgb = convert.hsl.rgb([color.h, color.s * 100, color.l * 100])
	const r = rgb[0],
		g = rgb[1],
		b = rgb[2]

		// The YIQ formula
		return r * 0.299 + g * 0.587 + b * 0.114 > 128 ? BLACK : WHITE
}

/**
 * Lighten the color
 * @param {HSLInterface} color : color in HSL format
 * @param {number} lightDifferrence : light modification desired
 * @returns {HSLInterface}
 */
const lightenColor = (color: HSLInterface, lightDifferrence: number) : HSLInterface => {
	return Object.assign(new HSL(), color, { l: Math.max(0.02, Math.min(color.l + lightDifferrence, 0.98)) });
}

/**
 * Create darken variation of color
 * @param {number} numberOfVariation : number of darken color variation
 * @param {HSLInterface} color : base color 
 * @returns HSLInterface[]
 */
const generateDarkenVariations = (
	numberOfVariation: number,
	color : HSLInterface
): HSLInterface[] => {
	return [...Array(numberOfVariation).keys()].map(
		(i) => new HSL([color.h, color.s, color.l * 0.8 ** i])
	)
}

/**
 * Create analogous palettes from color
 * @param {HSLInterface} color : 
 * @returns 
 */
const deriveAnalogousPalettes = (color: HSLInterface) : HSLInterface[][] => {
	return [
		generateDarkenVariations(4, {h: (color.h - 45) % 360, s: 0.75 * color.s, l: color.l }),
		generateDarkenVariations(4, {h: (color.h + 45) % 360, s: 0.75 * color.s, l: color.l }),
		generateDarkenVariations(4, {h: (color.h + 90) % 360, s: 0.75 * color.s, l: color.l }),
	]
}

/**
 * Invert HSL color light
 * @param {HSLInterface} color : base color
 * @returns 
 */
const invertLightColor = (color: HSLInterface): HSLInterface => {
	return Object.assign(new HSL(),  color, { l: color.l ? 0 : 1 });
}

/**
 * Create theme for application from themeColor
 * @param {HSLInterface} themeColor : base color for application theme
 * @returns 
 */
export const generateTheme = (themeColor: HSLInterface) => {
	const // Use the default theme color if the host page hasn't made a choice
		color = themeColor,
		lightColor = lightenColor(color, 0.1),
		darkColor = lightenColor(color, -0.2),
		lighterColor = lightenColor(color, 0.45),
		lightestColor = lightenColor(color, 1),
		darkestColor = lightenColor(color, -1),
		grayColor = new HSL([0, 0, 0, 0.6]),
		textColor = findContrastedTextColor(color),
		inverseTextColor = invertLightColor(textColor),
		lighterTextColor = Object.assign(new HSL(), darkColor, { a: 0.8 }),
		lighterInverseTextColor = Object.assign(new HSL(), inverseTextColor, { a: 0.7 }),
		textColorOnWhite = !!textColor.l ? color : new HSL([0, 0, 20]),
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

export const ThemeColorsContext = createContext<ThemeColors>(
	generateTheme(DEFAULT_COLOR)
)

type ProviderProps = {
	color?: HSLInterface
	children: React.ReactNode
}

export function ThemeColorsProvider({ color, children }: ProviderProps) {
	const colorsContext = useContext(ThemeColorsContext);
	const colors = color ? generateTheme(color) : colorsContext;
	const divRef = useRef<HTMLDivElement>(null);
	
	useEffect(() => {
		Object.entries(colors).forEach(([key, value]) => {
			if (value instanceof HSL) {
				
				divRef.current?.style.setProperty(`--${key}`, value.toString())
			}
		}, colors)
	}, [colors])
	return (
		<ThemeColorsContext.Provider value={colors}>
			{/* This div is only used to set the CSS variables */}
			<div
				id="colorProvider"
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
