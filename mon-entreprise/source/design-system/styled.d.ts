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

type Spacing = string

declare module 'styled-components' {
	export interface DefaultTheme {
		colors: {
			bases: {
				primary: Palette
				seconday: Palette
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
	}
}
