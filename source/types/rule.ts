// TODO : it is possible to have a better typing of the DottedName (ie having
// the exact list of rule names). It works by default with a JSON import (using
// keyof JsonRules) but not with Yaml. There are some discussions on the
// TypeScript bug tracker to add support for loader plugins that would allow
// yaml typings. Another solution is to persist a json on the file system, but
// we have to keep it in sync with the yaml.
export type DottedName = string

export type Rule = {
	dottedName: DottedName
	nodeValue?: number
	question?: string
	unit: string
	name?: string
	title?: string
}
