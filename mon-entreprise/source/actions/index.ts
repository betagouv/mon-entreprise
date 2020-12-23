import { Action as BaseAction } from './actions'
import { Action as CompanyCreationChecklistAction } from './companyCreationChecklistActions'
import { CompanyStatusAction } from './companyStatusActions'
import { ActionExistingCompany } from './existingCompanyActions'
import { Action as HiringChecklistAction } from './hiringChecklistAction'

export type EveryAction =
	| BaseAction
	| CompanyStatusAction
	| CompanyCreationChecklistAction
	| ActionExistingCompany
	| HiringChecklistAction
