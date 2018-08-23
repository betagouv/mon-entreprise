/* @flow */
import type {
	InitializeHiringChecklistAction,
	CheckHiringItemAction
} from 'Types/hiringChecklistTypes'

export const initializeHiringChecklist = (checklistItems: Array<string>) =>
	({
		type: 'INITIALIZE_HIRING_CHECKLIST',
		checklistItems
	}: InitializeHiringChecklistAction)

export const checkHiringItem = (name: string, checked: boolean) =>
	({
		type: 'CHECK_HIRING_ITEM',
		name,
		checked
	}: CheckHiringItemAction)
