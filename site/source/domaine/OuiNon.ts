export type OuiNon = 'oui' | 'non'

export const isOuiNon = (value: unknown): value is OuiNon =>
	typeof value === 'string' && (value === 'oui' || value === 'non')
