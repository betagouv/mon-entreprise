import { SitePathsContext } from '@/components/utils/SitePathsContext'
import { companySituationSelector } from '@/selectors/simulationSelectors'
import { useContext } from 'react'
import { useSelector } from 'react-redux'
import { generatePath } from 'react-router'

export const useGérerPath = () => {
	const sitePaths = useContext(SitePathsContext)
	const company = useSelector(companySituationSelector)
	const siren = (company['entreprise . SIREN'] as string).replace(/'/g, '')

	return generatePath(sitePaths.gérer.index, { entreprise: siren })
}
