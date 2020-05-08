export type Action = InitializeHiringChecklistAction | CheckHiringItemAction

type InitializeHiringChecklistAction = ReturnType<
	typeof initializeHiringChecklist
>
type CheckHiringItemAction = ReturnType<typeof checkHiringItem>

export const initializeHiringChecklist = (checklistItems: Array<string>) =>
	({
		type: 'INITIALIZE_HIRING_CHECKLIST',
		checklistItems
	} as const)

export const checkHiringItem = (name: string, checked: boolean) =>
	({
		type: 'CHECK_HIRING_ITEM',
		name,
		checked
	} as const)
