import useSimulatorsData from '@/pages/Simulateurs/metadata'
import { useSitePaths } from '@/sitePaths'
import { useLocation } from 'react-router-dom'

export const useShowFeedback = () => {
	const currentPath = useLocation().pathname
	const { absoluteSitePaths } = useSitePaths()
	const simulators = useSimulatorsData()

	const blacklisted = [
		absoluteSitePaths.gérer.déclarationIndépendant.beta.cotisations as string,
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
		absoluteSitePaths.index,
		...Object.values(simulators).map((s) => s.path),
		'',
		'/',
	].includes(currentPath)
}
