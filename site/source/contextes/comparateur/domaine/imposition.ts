export const Impositions = ['IR', 'IS'] as const
export type IRouIS = (typeof Impositions)[number]

export const MéthodesImposition = [
	'barème standard',
	'taux personnalisé',
] as const
export type MéthodeImposition = (typeof MéthodesImposition)[number]

export const SituationsFamiliales = ['célibataire', 'couple', 'veuf'] as const
export type SituationFamiliale = (typeof SituationsFamiliales)[number]
