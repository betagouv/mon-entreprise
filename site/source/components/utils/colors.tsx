import React, { useEffect, useRef, useState } from 'react'
import { createGlobalStyle, ThemeProvider, useTheme } from 'styled-components'

import { useIsEmbedded } from '@/hooks/useIsEmbedded'
import { hexToHSL } from '@/utils/hexToHSL'

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
	import.meta.env.SSR ? '' : document.location.search.substring(1)
).get('couleur')

let iframeColor = DEFAULT_COLOR_HS
try {
	if (rawIframeColor) {
		iframeColor = JSON.parse(decodeURIComponent(rawIframeColor)) as number[]
	}
} catch (error) {
	// eslint-disable-next-line no-console
	console.error(error)
}
const IFRAME_COLOR = iframeColor

// Note that the iframeColor is first set in the index.html file, but without
// the full palette generation that happen here. This is to prevent a UI
// flash, cf. #1786.

const GlobalCssVar = createGlobalStyle<{
	$hue: number
	$saturation: number
}>`
html {
	--${HUE_CSS_VARIABLE_NAME}: ${({ $hue }) => $hue}deg;
	--${SATURATION_CSS_VARIABLE_NAME}: ${({ $saturation }) => $saturation}%;
}
`

export function ThemeColorsProvider({ children }: ProviderProps) {
	const divRef = useRef<HTMLDivElement>(null)
	const [themeColor, setThemeColor] = useState(IFRAME_COLOR)
	useEffect(() => {
		window.addEventListener(
			'message',
			(evt: MessageEvent<{ kind: string; value: string }>) => {
				if (evt.data.kind === 'change-theme-color') {
					console.log('change-theme-color', evt.data.value)
					setThemeColor(hexToHSL(evt.data.value))
				}
			}
		)
	}, [])

	const isEmbeded = useIsEmbedded()
	const defaultTheme = useTheme()
	if (!themeColor && !isEmbeded) {
		return <>{children}</>
	}

	const [hue, saturation] = themeColor

	return (
		<ThemeProvider
			theme={{
				...defaultTheme,
				colors: {
					...defaultTheme.colors,
					bases: { ...defaultTheme.colors.bases, primary: PALETTE },
				},
			}}
		>
			<GlobalCssVar $hue={hue} $saturation={saturation} />
			{/* This div is only used to set the CSS variables */}
			<div
				ref={divRef}
				data-js-color-element
				style={{
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				{children}
			</div>
		</ThemeProvider>
	)
}
