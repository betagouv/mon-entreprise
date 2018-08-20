/* @flow */
import type {
	InitializeCompanyCreationChecklistAction,
	CheckCompanyCreationItemAction
} from 'Types/companyCreationChecklistTypes'

export const initializeCompanyCreationChecklist = (
	statusName: string,
	checklistItems: Array<string>
) =>
	({
		type: 'INITIALIZE_COMPANY_CREATION_CHECKLIST',
		checklistItems,
		statusName
	}: InitializeCompanyCreationChecklistAction)

export const checkCompanyCreationItem = (name: string, checked: boolean) =>
	({
		type: 'CHECK_COMPANY_CREATION_ITEM',
		name,
		checked
	}: CheckCompanyCreationItemAction)
