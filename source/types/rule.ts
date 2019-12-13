import jsonRules from './dottednames.json'
export type DottedName = keyof typeof jsonRules

export type Rule = {
	dottedName: DottedName
	nodeValue?: number
	question?: string
	unit: string
	name?: string
	title?: string
}
