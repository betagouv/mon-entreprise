import { LegalStatus } from 'Selectors/companyStatusSelectors'

export type Action =
	| InitializeCompanyCreationChecklistAction
	| CheckCompanyCreationItemAction

type InitializeCompanyCreationChecklistAction = ReturnType<
	typeof initializeCompanyCreationChecklist
>
type CheckCompanyCreationItemAction = ReturnType<
	typeof checkCompanyCreationItem
>

export const initializeCompanyCreationChecklist = (
	statusName: LegalStatus,
	checklistItems: Array<string>
) =>
	({
		type: 'INITIALIZE_COMPANY_CREATION_CHECKLIST',
		checklistItems,
		statusName
	} as const)

export const checkCompanyCreationItem = (name: string, checked: boolean) =>
	({
		type: 'CHECK_COMPANY_CREATION_ITEM',
		name,
		checked
	} as const)
