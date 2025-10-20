import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { getCookieValue } from '@/storage/readCookie'
import { companySirenSelector } from '@/store/selectors/companySiren.selector'

import { useEntreprisesRepository } from './useRepositories'
import { useSetEntreprise } from './useSetEntreprise'

export default function useSetEntrepriseFromUrssafConnection() {
	const setEntreprise = useSetEntreprise()
	const siret = siretFromUrssafFrConnection()
	const existingCompany = !!useSelector(companySirenSelector)
	const entreprisesRepository = useEntreprisesRepository()

	useEffect(() => {
		if (siret && !existingCompany) {
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
	}, [siret, existingCompany])
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
