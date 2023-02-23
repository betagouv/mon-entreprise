import { LegalStatus } from '@/store/selectors/companyStatusSelectors'

export type CompanyCreationAction = ReturnType<
	typeof initializeCompanyCreationChecklist | typeof checkCompanyCreationItem
>

export const initializeCompanyCreationChecklist = (
	statusName: LegalStatus,
	checklistItems: Array<string>
) =>
	({
		type: 'INITIALIZE_COMPANY_CREATION_CHECKLIST',
		checklistItems,
		statusName,
	} as const)

export const checkCompanyCreationItem = (name: string, checked: boolean) =>
	({
		type: 'CHECK_COMPANY_CREATION_ITEM',
		name,
		checked,
	} as const)
