type Screen = 'phone' | 'tablet' | 'desktop'

export const breakpoints: Record<Screen, string> = {
	phone: '0px',
	tablet: '850px',
	desktop: '1200px',
}
