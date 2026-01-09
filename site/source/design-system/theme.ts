import { Theme } from '@/types/styled'
import { Merge } from '@/types/utils'

import { KeysOfUnion } from './types'

export const baseTheme = {
	colors: {
		bases: {
			primary: {
				100: '#EFF4FF',
				200: '#DBE7FF',
				300: '#B6CEFC',
				400: '#9EBBF1',
				500: '#6B93DA',
				600: '#2E5FB6',
				700: '#1D458C',
				800: '#122F62',
			},
			secondary: {
				100: '#E0FDFF',
				200: '#AFFBFF',
				300: '#7AEEF4',
				400: '#56DFE7',
				500: '#20BFC8',
				600: '#008088',
				700: '#0D5A5E',
				800: '#093A3E',
			},
			tertiary: {
				100: '#FFF4D2',
				200: '#FFE38A',
				300: '#FFD60C',
				400: '#FFBB0C',
				500: '#C2900D',
				600: '#7D5B04',
				700: '#5A4203',
				800: '#402E01',
			},
		},

		publics: {
			employeur: {
				100: '#E5F8EB',
				200: '#C1F6FE',
				300: '#91E4F2',
				400: '#63D4E7',
				500: '#21BFDC',
				600: '#007B91',
				700: '#015D6D',
				800: '#023F4A',
			},
			particulier: {
				100: '#FFF2ED',
				200: '#FFDED1',
				300: '#FFB79C',
				400: '#FF9B75',
				500: '#FF703A',
				600: '#B53708',
				700: '#8C2904',
				800: '#5E1D01',
			},
			independant: {
				100: '#FFF0F1',
				200: '#FFDDE0',
				300: '#FFB8C3',
				400: '#FF99A3',
				500: '#F66775',
				600: '#CC2434',
				700: '#A31927',
				800: '#7D0713',
			},
			artisteAuteur: {
				100: '#FAF0FB',
				200: '#F8E0F8',
				300: '#ECC0F0',
				400: '#D7A4DC',
				500: '#B880BD',
				600: '#734278',
				700: '#602F65',
				800: '#4A184F',
			},
			marin: {
				100: '#EAFEF8',
				200: '#C1FFEC',
				300: '#84FAD6',
				400: '#52EABC',
				500: '#16DCA1',
				600: '#00875F',
				700: '#066549',
				800: '#02412F',
			},
		},

		extended: {
			grey: {
				100: '#FFFFFF',
				200: '#F8F9FA',
				300: '#E6E9EC',
				400: '#CDD3D9',
				500: '#ADB5BD',
				600: '#6C757D',
				700: '#495057',
				800: '#212529',
			},
			error: {
				100: '#FDE8E9',
				200: '#F9BCC0',
				300: '#DB666E',
				400: '#CB111D',
				500: '#96050F',
				600: '#52070C',
			},
			success: {
				100: '#DCFCDE',
				200: '#AAF0B1',
				300: '#7DE38A',
				400: '#53D769',
				500: '#3CB053',
				600: '#18632C',
			},
			info: {
				100: '#FFFCE0',
				200: '#FFF5B8',
				300: '#FDDF64',
				400: '#F0C100',
				500: '#D3AA00',
				600: '#6B5700',
			},
			dark: {
				100: '#e2e8f0',
				200: '#cbd5e1',
				300: '#94a3b8',
				400: '#64748b',
				500: '#475569',
				600: '#334155',
				700: '#1e293b',
				800: '#0f172a',
			},
		},
	},
	darkMode: false,
	spacings: {
		xxxs: '.125rem',
		xxs: '.25rem',
		xs: '.5rem',
		sm: '0.75rem',
		md: '1rem',
		lg: '1.5rem',
		xl: '2rem',
		xxl: '3rem',
		xxxl: '4rem',
	},

	fonts: {
		main: "'Roboto', sans-serif",
		heading: '',
	},

	baseFontSize: '1rem',

	fontSizes: {
		lg: '1.125rem',
	},

	box: {
		borderRadius: '6px',
		borderWidth: '1px',
	},

	elevations: {
		2: '0px 1px 2px rgba(0, 0, 0, 0.25)',
		3: '0px 4px 8px rgba(0, 0, 0, 0.2);',
		4: '0px 6px 12px rgba(0, 0, 0, 0.2);',
		5: '0px 8px 20px rgba(0, 0, 0, 0.15);',
		6: '0px 10px 24px rgba(0, 0, 0, 0.2)',
	},

	elevationsDarkMode: {
		2: '0px 1px 2px rgba(255, 255, 255, 0.25)',
		3: '0px 4px 8px rgba(255, 255, 255, 0.2);',
		4: '0px 6px 12px rgba(255, 255, 255, 0.2);',
		5: '0px 8px 20px rgba(255, 255, 255, 0.15);',
		6: '0px 10px 24px rgba(255, 255, 255, 0.2)',
	},

	breakpointsWidth: {
		sm: '576px',
		md: '768px',
		lg: '992px',
		xl: '1200px',
	},
}

type ColorsType = typeof baseTheme.colors
type ColorGroups = Merge<ColorsType[keyof ColorsType]>

export type Colors = KeysOfUnion<ColorsType[keyof ColorsType]>

/**
 * Check if a color is in the theme
 * @param color
 */
export const isColor = (color: string): color is Colors =>
	Object.values(baseTheme.colors).some((val) => color in val)

/**
 * Get the color group of a color
 * @example getColorGroup('error') => { 100: '#FDE8E9', 200: '#F9BCC0', 300: '#DB666E', 400: '#CB111D', 500: '#96050F', 600: '#52070C' }
 * @param color
 */
export const getColorGroup = <T extends Colors>(color: T) => {
	const colorGroup = Object.values(baseTheme.colors).find(
		(val) => color in val
	) as ColorGroups | undefined

	if (colorGroup && color in colorGroup) {
		return (
			(colorGroup[color as keyof ColorGroups] as Merge<
				NonNullable<ColorGroups[T]>
			>) ?? null
		)
	}

	return null
}

// We use the Grid from material-ui, we need to uniformise
// breakpoints and spacing with the Urssaf design system
export type SpacingKey = keyof typeof baseTheme.breakpointsWidth
const breakpoints = Object.fromEntries(
	Object.entries(baseTheme.breakpointsWidth).map(([key, value]) => [
		key,
		Number.parseInt(value),
	])
) as Record<SpacingKey, number>

const theme = {
	breakpoints: {
		values: {
			xs: 0,
			...breakpoints,
		},
	},
	spacing: Object.values(baseTheme.spacings),

	...baseTheme,
} satisfies Theme

export { theme }
