import { useEffect, useState } from 'react'

import useSimulatorsData from '@/hooks/useSimulatorsData'
import { useNavigation } from '@/lib/navigation'
import { useSitePaths } from '@/sitePaths'

const PAGE_TITLE = 'Un avis sur cette page ?'
const SIMULATOR_TITLE = 'Un avis sur cet outil ?'

export const useFeedback = () => {
	const [shouldShowRater, setShouldShowRater] = useState(false)
	const { currentPath } = useNavigation()
	const currentPathDecoded = decodeURI(currentPath)
	const { absoluteSitePaths } = useSitePaths()
	const simulators = useSimulatorsData()

	useEffect(() => {
		if (
			// Exclure les pages exactes
			![
				absoluteSitePaths.index,
				'',
				'/',
				absoluteSitePaths.simulateurs.index,
				absoluteSitePaths.plan,
				absoluteSitePaths.budget,
				absoluteSitePaths.assistants.index,
				absoluteSitePaths.assistants['choix-du-statut'].index,
				absoluteSitePaths.assistants['choix-du-statut']['recherche-activité'],
				absoluteSitePaths.assistants['choix-du-statut']['détails-activité'],
				absoluteSitePaths.accessibilité,
			].includes(currentPathDecoded) &&
			// Exclure les pages et sous-pages
			![
				absoluteSitePaths.documentation.index,
				absoluteSitePaths.nouveautés.index,

				absoluteSitePaths.stats,
				absoluteSitePaths.développeur.index,
			].some((path) => currentPathDecoded.includes(path))
		) {
			setShouldShowRater(true)
		} else {
			setShouldShowRater(false)
		}
	}, [absoluteSitePaths, currentPathDecoded, shouldShowRater, simulators])

	return {
		customTitle: shouldShowRater ? SIMULATOR_TITLE : PAGE_TITLE,
		shouldShowRater,
	}
}
