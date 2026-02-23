import { useDispatch, useSelector } from 'react-redux'

import { EntrepriseSearchField } from '@/components/entreprise/EntrepriseSearchField'
import { Spacing } from '@/design-system'
import { Entreprise } from '@/domaine/Entreprise'
import { useSetEntreprise } from '@/hooks/useSetEntreprise'
import useSetEntrepriseFromUrssafConnection from '@/hooks/useSetEntrepriseFromUrssafConnection'
import { resetCompany } from '@/store/actions/companyActions'
import { companySirenSelector } from '@/store/selectors/company/companySiren.selector'

import SelectedEntrepriseDetails from '../entreprise/SelectedEntrepriseDetails'

type Props = {
	onSubmit?: (établissement: Entreprise | null) => void
}

export default function EntrepriseInput({ onSubmit }: Props) {
	const existingCompany = !!useSelector(companySirenSelector)
	useSetEntrepriseFromUrssafConnection()
	const setEntreprise = useSetEntreprise()
	const dispatch = useDispatch()
	const handleCompanySubmit = (établissement: Entreprise | null) => {
		setEntreprise(établissement)
		onSubmit?.(établissement)
	}
	const handleCompanyClear = () => {
		dispatch(resetCompany())
	}

	return (
		<>
			<EntrepriseSearchField
				onSubmit={handleCompanySubmit}
				onClear={handleCompanyClear}
				selectedValue={existingCompany ? <SelectedEntrepriseDetails /> : null}
			/>
			<Spacing md />
		</>
	)
}
