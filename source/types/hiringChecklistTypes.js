/* @flow */

export type InitializeHiringChecklistAction = {
	type: 'INITIALIZE_HIRING_CHECKLIST',
	checklistItems: Array<string>
}

export type CheckHiringItemAction = {
	type: 'CHECK_HIRING_ITEM',
	name: string,
	checked: boolean
}

export type Action = InitializeHiringChecklistAction | CheckHiringItemAction
