import React, { useEffect, useRef, useState } from 'react'
import { ThemeProvider } from 'styled-components'

import { hexToHSL } from '@/hexToHSL'

import { useIsEmbedded } from './useIsEmbedded'

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

export function ThemeColorsProvider({ children }: ProviderProps) {
	const divRef = useRef<HTMLDivElement>(null)
	const [themeColor, setThemeColor] = useState(IFRAME_COLOR)
	useEffect(() => {
		window.addEventListener('message', (evt: MessageEvent) => {
			if (evt.data.kind === 'change-theme-color') {
				setThemeColor(hexToHSL(evt.data.value))
			}
		})
	}, [])
	const [hue, saturation] = themeColor
	useEffect(() => {
		const root = document.querySelector(':root') as HTMLElement | undefined
		root?.style.setProperty(`--${HUE_CSS_VARIABLE_NAME}`, `${hue}deg`)
		root?.style.setProperty(
			`--${SATURATION_CSS_VARIABLE_NAME}`,
			`${saturation}%`
		)
	}, [hue, saturation])
	const isEmbeded = useIsEmbedded()
	if (!themeColor && !isEmbeded) {
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
				data-js-color-element
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
