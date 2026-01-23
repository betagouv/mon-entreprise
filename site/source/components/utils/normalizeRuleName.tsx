export const normalizeRuleName = (dottedName: string) =>
	dottedName.replace(/\s|\.|'|’/g, '_')

normalizeRuleName.Label = (dottedName: string) =>
	`${normalizeRuleName(dottedName)}-label`

normalizeRuleName.Input = (dottedName: string) =>
	`${normalizeRuleName(dottedName)}-input`

normalizeRuleName.Value = (dottedName: string) =>
	`${normalizeRuleName(dottedName)}-value`

normalizeRuleName.Description = (dottedName: string) =>
	`${normalizeRuleName(dottedName)}-description`
