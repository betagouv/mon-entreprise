import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { EntrepriseSearchField } from '@/components/entreprise/EntrepriseSearchField'
import { useEngine } from '@/components/utils/EngineContext'
import { Spacing } from '@/design-system'
import { Entreprise } from '@/domaine/Entreprise'
import { useEntreprisesRepository } from '@/hooks/useRepositories'
import { useSetEntreprise } from '@/hooks/useSetEntreprise'
import { getCookieValue } from '@/storage/readCookie'
import { resetCompany } from '@/store/actions/companyActions'
import { companySirenSelector } from '@/store/selectors/companySiren.selector'

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

function useSetEntrepriseFromUrssafConnection() {
	const setEntreprise = useSetEntreprise()
	const siret = siretFromUrssafFrConnection()
	const companySIREN = useEngine().evaluate('entreprise . SIREN').nodeValue
	const entreprisesRepository = useEntreprisesRepository()

	useEffect(() => {
		if (siret && !companySIREN) {
			entreprisesRepository
				.rechercheTexteLibre(siret)
				.then((results) => {
					if (results?.length !== 1) {
						return
					}
					setEntreprise(results[0])
				})
				.catch((err) => {
					console.log(err)
					console.log(`Could not fetch company details for ${siret}`)
				})
		}
	}, [siret, companySIREN])
}

// We can read cookies set on the urssaf.fr domain, which contain informations
// such as the SIRET number. The cookie format could change at any time so we
// wrap its read access in a `try / catch`.
function siretFromUrssafFrConnection(): string | null {
	try {
		// Note: The `ctxUrssaf` contains more informations, but currently we only
		// need to retreive the SIRET which is slightly more easy to read from the
		// `EnLigne` cookie.
		const cookieValue = decodeURIComponent(getCookieValue('EnLigne'))
		const siret = cookieValue.match('siret=([0-9]{14})')?.pop()

		return siret ?? null
	} catch {
		return null
	}
}
