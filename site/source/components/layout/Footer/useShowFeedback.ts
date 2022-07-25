import { SitePathsContext } from '@/components/utils/SitePathsContext'
import { useContext } from 'react'
import { useLocation } from 'react-router-dom'
import useSimulatorsData from '@/pages/Simulateurs/metadata'

export const useShowFeedback = () => {
	const currentPath = useLocation().pathname
	const sitePath = useContext(SitePathsContext)
	const simulators = useSimulatorsData()

	const blacklisted = [
		sitePath.gérer.déclarationIndépendant.beta.cotisations as string,
	].includes(currentPath)

	if (blacklisted) {
		return false
	}

	if (
		[
			simulators['déclaration-charges-sociales-indépendant'],
			simulators['comparaison-statuts'],
			simulators['demande-mobilité'],
		]
			.map((s) => s.path as string)
			.includes(currentPath)
	) {
		return true
	}

	return ![
		sitePath.index,
		...Object.values(simulators).map((s) => s.path),
		'',
		'/',
	].includes(currentPath)
}
