import React, { useEffect, useMemo, useRef } from 'react'
import { ThemeProvider } from 'styled-components'
import { useIsEmbedded } from './embeddedContext'

type ProviderProps = {
	color?: [number, number, number]
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

const rawIframeColor = new URLSearchParams(
	document.location.search.substring(1)
).get('couleur')
const IFRAME_COLOR: [number, number] = rawIframeColor
	? JSON.parse(decodeURIComponent(rawIframeColor))
	: DEFAULT_COLOR_HS

// Note that the iframeColor is first set in the index.html file, but without
// the full palette generation that happen here. This is to prevent a UI
// flash, cf. #1786.

export function ThemeColorsProvider({ color, children }: ProviderProps) {
	const divRef = useRef<HTMLDivElement>(null)
	const [hue, saturation] = useMemo(
		() => (color ? color.slice(0, 2) : IFRAME_COLOR),
		[color]
	)
	useEffect(() => {
		divRef.current?.style.setProperty(`--${HUE_CSS_VARIABLE_NAME}`, '' + hue)
		divRef.current?.style.setProperty(
			`--${SATURATION_CSS_VARIABLE_NAME}`,
			`${saturation}%`
		)
	}, [hue, saturation])
	const isEmbedded = useIsEmbedded()

	if (!color && !isEmbedded) {
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
