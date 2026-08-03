export type OuiNon = 'oui' | 'non'

export const isOuiNon = (value: unknown): value is OuiNon =>
	typeof value === 'string' && (value === 'oui' || value === 'non')

export const toOuiNon = (value: boolean): OuiNon => (value ? 'oui' : 'non')

export const fromOuiNon = (value: OuiNon | undefined): boolean =>
	value === 'oui'
