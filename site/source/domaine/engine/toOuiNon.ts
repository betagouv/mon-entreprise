// TODO : Déplacer ça dans https://github.com/publicodes/publicodes/ ?
export const toOuiNon = (newValue: boolean | undefined) =>
	newValue === undefined ? undefined : newValue ? 'oui' : 'non'
