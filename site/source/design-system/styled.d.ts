import {
	Theme as SystemTheme,
	ThemeOptions as SystemThemeOptions,
} from '@mui/system'
import 'styled-components'

type Color = string

type Palette = {
	100: Color
	200: Color
	300: Color
	400: Color
	500: Color
	600: Color
	700: Color
	800: Color
}

type SmallPalette = {
	100: Color
	200: Color
	300: Color
	400: Color
	500: Color
	600: Color
}
type Metric = string

type Spacing = Metric

type Font = string

type FontSize = Metric

type ShadowDefinition = string

interface CustomTheme {
	colors: {
		bases: {
			primary: Palette
			secondary: Palette
			tertiary: Palette
		}

		publics: {
			employeur: Palette
			particulier: Palette
			independant: Palette
			artisteAuteur: Palette
			marin: Palette
		}

		extended: {
			grey: Palette
			error: SmallPalette
			success: SmallPalette
			info: SmallPalette
		}
	}

	spacings: {
		xxs: Spacing
		xs: Spacing
		sm: Spacing
		md: Spacing
		lg: Spacing
		xl: Spacing
		xxl: Spacing
		xxxl: Spacing
	}

	fonts: {
		main: Font
		heading: Font
	}

	baseFontSize: FontSize

	box: {
		borderRadius: Metric
		borderWidth: Metric
	}

	elevations: {
		2: ShadowDefinition
		3: ShadowDefinition
		4: ShadowDefinition
		5: ShadowDefinition
		6: ShadowDefinition
	}

	breakpointsWidth: {
		xl: Metric
		lg: Metric
		md: Metric
		sm: Metric
	}

	darkMode: boolean
}

declare module '@mui/material/styles' {
	export interface Theme extends SystemTheme, CustomTheme {}
	export interface ThemeOptions extends SystemThemeOptions, CustomTheme {}
}

declare module 'styled-components' {
	export interface DefaultTheme extends SystemTheme, CustomTheme {}
}
