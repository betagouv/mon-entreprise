/* @flow */

export type InitializeCompanyCreationChecklistAction = {
	type: 'INITIALIZE_COMPANY_CREATION_CHECKLIST',
	checklistItems: Array<string>,
	statusName: string
}

export type CheckCompanyCreationItemAction = {
	type: 'CHECK_COMPANY_CREATION_ITEM',
	name: string,
	checked: boolean
}

export type Action =
	| InitializeCompanyCreationChecklistAction
	| CheckCompanyCreationItemAction
