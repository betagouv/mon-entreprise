import { DottedName } from '@/domaine/publicodes/DottedName'

export const normalizeRuleName = (dottedName: DottedName) =>
	dottedName.replace(/\s|\./g, '_')

normalizeRuleName.Label = (dottedName: DottedName) =>
	`${normalizeRuleName(dottedName)}-label`

normalizeRuleName.Input = (dottedName: DottedName) =>
	`${normalizeRuleName(dottedName)}-input`

normalizeRuleName.Value = (dottedName: DottedName) =>
	`${normalizeRuleName(dottedName)}-value`

normalizeRuleName.Description = (dottedName: DottedName) =>
	`${normalizeRuleName(dottedName)}-description`
