export const NaturesActivité = [
	'artisanale',
	'commerciale',
	'libérale',
] as const
export type NatureActivité = (typeof NaturesActivité)[number]

export const TypesActivité = ['vente', 'service'] as const
export type TypeActivité = (typeof TypesActivité)[number]
