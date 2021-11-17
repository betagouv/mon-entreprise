import convert from 'color-convert'
import React, { createContext, useEffect, useMemo, useRef } from 'react'
import { ThemeProvider } from 'styled-components'

export const ThemeColorsContext = createContext({
	palettes: [
		['red', 'red', 'red'],
		['blue', 'blue', 'blue'],
	],
})

type ProviderProps = {
	color?: string | null
	children: React.ReactNode
}

const HUE_CSS_VARIABLE_NAME = 'COLOR_HUE'
const SATURATION_CSS_VARIABLE_NAME = 'COLOR_SATURATION'
const DEFAULT_COLOR_HS = [220, 100]
const PALETTE = {
	100: `hsl(var(--${HUE_CSS_VARIABLE_NAME}), var(--${SATURATION_CSS_VARIABLE_NAME}), 97%)`,
	200: `hsl(var(--${HUE_CSS_VARIABLE_NAME}), var(--${SATURATION_CSS_VARIABLE_NAME}), 93%)`,
	300: `hsl(var(--${HUE_CSS_VARIABLE_NAME}), calc(var(--${SATURATION_CSS_VARIABLE_NAME}) - 8%), 85%)`,
	400: `hsl(var(--${HUE_CSS_VARIABLE_NAME}), calc(var(--${SATURATION_CSS_VARIABLE_NAME}) - 25%), 78%)`,
	500: `hsl(var(--${HUE_CSS_VARIABLE_NAME}), calc(var(--${SATURATION_CSS_VARIABLE_NAME}) - 40%), 64%)`,
	600: `hsl(var(--${HUE_CSS_VARIABLE_NAME}), calc(var(--${SATURATION_CSS_VARIABLE_NAME}) - 40%), 45%)`,
	700: `hsl(var(--${HUE_CSS_VARIABLE_NAME}), calc(var(--${SATURATION_CSS_VARIABLE_NAME}) - 34%), 33%)`,
	800: `hsl(var(--${HUE_CSS_VARIABLE_NAME}), calc(var(--${SATURATION_CSS_VARIABLE_NAME}) - 31%), 23%)`,
}
export function ThemeColorsProvider({ color, children }: ProviderProps) {
	const divRef = useRef<HTMLDivElement>(null)
	const [hue, saturation] = useMemo(
		() =>
			color ? convert.hex.hsl(color.slice(1)).slice(0, 2) : DEFAULT_COLOR_HS,
		[color]
	)
	useEffect(() => {
		divRef.current?.style.setProperty(`--${HUE_CSS_VARIABLE_NAME}`, '' + hue)
		divRef.current?.style.setProperty(
			`--${SATURATION_CSS_VARIABLE_NAME}`,
			`${saturation}%`
		)
	}, [hue, saturation])
	if (!color) {
		return <>{children}</>
	}

	return (
		<ThemeProvider
			theme={(theme) => ({
				...theme,
				colors: {
					...theme.colors,
					bases: { ...theme.colors.bases, primary: PALETTE },
				},
			})}
		>
			{/* This div is only used to set the CSS variables */}
			<div
				ref={divRef}
				className="js-color-element"
				css={`
					height: 100%;
					display: flex;
					flex-direction: column;
				`}
			>
				{children}
			</div>
		</ThemeProvider>
	)
}
