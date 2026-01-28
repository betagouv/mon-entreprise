import React, { useEffect, useState } from 'react'
import { ThemeProvider, useTheme } from 'styled-components'

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

function parseIframeColorFromURL(): number[] | null {
	try {
		const rawColor = new URLSearchParams(window.location.search).get('couleur')
		if (rawColor) {
			return JSON.parse(decodeURIComponent(rawColor)) as number[]
		}
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error)
	}

	return null
}

// Note that the iframeColor is first set in the index.html file, but without
// the full palette generation that happen here. This is to prevent a UI
// flash, cf. #1786.

export function ThemeColorsProvider({ children }: ProviderProps) {
	const isEmbedded = useIsEmbedded()
	const [themeColor, setThemeColor] = useState(DEFAULT_COLOR_HS)

	useEffect(() => {
		if (isEmbedded) {
			const colorFromURL = parseIframeColorFromURL()
			if (colorFromURL) {
				setThemeColor(colorFromURL)
			}
		}

		const handleMessage = (evt: MessageEvent) => {
			if (evt.data.kind === 'change-theme-color') {
				setThemeColor(hexToHSL(evt.data.value))
			}
		}
		window.addEventListener('message', handleMessage)

		return () => window.removeEventListener('message', handleMessage)
	}, [isEmbedded])

	const [hue, saturation] = themeColor
	useEffect(() => {
		const root = document.querySelector(':root') as HTMLElement | undefined
		root?.style.setProperty(`--${HUE_CSS_VARIABLE_NAME}`, `${hue}deg`)
		root?.style.setProperty(
			`--${SATURATION_CSS_VARIABLE_NAME}`,
			`${saturation}%`
		)
	}, [hue, saturation])
	const defaultTheme = useTheme()
	if (!themeColor && !isEmbedded) {
		return <>{children}</>
	}

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
			{/* This div is only used to set the CSS variables */}
			<div
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
