import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import useSimulatorsData from '@/pages/Simulateurs/metadata'
import { useSitePaths } from '@/sitePaths'

const PAGE_TITLE = 'Un avis sur cette page ?'
const SIMULATOR_TITLE = 'Un avis sur ce simulateur ?'

export const useFeedback = () => {
	const [shouldShowRater, setShouldShowRater] = useState(false)
	const currentPath = useLocation().pathname
	const { absoluteSitePaths } = useSitePaths()
	const simulators = useSimulatorsData()

	useEffect(() => {
		if (
			// Exclure les pages exactes
			![
				absoluteSitePaths.index,
				'',
				'/',
				'/simulateurs',
				'/plan-de-site',
				'/budget',
				'/accessibilit%C3%A9',
			].includes(currentPath) &&
			// Exclure les pages et sous-pages
			![
				'/documentation',
				'/g%C3%A9rer',
				'/cr%C3%A9er',
				'/nouveaut%C3%A9s',
				'/stats',
				'/d%C3%A9veloppeur',
			].some((path) => currentPath.includes(path))
		) {
			setShouldShowRater(true)
		} else {
			setShouldShowRater(false)
		}
	}, [absoluteSitePaths.index, currentPath, shouldShowRater, simulators])

	return {
		customTitle: shouldShowRater ? SIMULATOR_TITLE : PAGE_TITLE,
		shouldShowRater,
	}
}
