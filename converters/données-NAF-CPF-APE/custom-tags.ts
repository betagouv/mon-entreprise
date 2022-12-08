
interface CustomTags {
	[codeAPE: string]: {
		contenuCentral: string[]
		contenuAnnexe: string[]
		contenuExclu: string[]
	}
}

export const customTags: CustomTags = {
	'62.01Z': {
		contenuCentral: ['développeur', 'informatique', 'web'],
		contenuAnnexe: [],
		contenuExclu: [],
	},
}
