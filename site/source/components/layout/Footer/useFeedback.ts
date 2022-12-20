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
				`${absoluteSitePaths.index}simulateurs`,
				`${absoluteSitePaths.index}plan-de-site`,
				`${absoluteSitePaths.index}budget`,
				`${absoluteSitePaths.index}accessibilit%C3%A9`,
			].includes(currentPath) &&
			// Exclure les pages et sous-pages
			![
				`${absoluteSitePaths.index}documentation`,
				`${absoluteSitePaths.index}g%C3%A9rer`,
				`${absoluteSitePaths.index}cr%C3%A9er`,
				`${absoluteSitePaths.index}nouveaut%C3%A9s`,
				`${absoluteSitePaths.index}stats`,
				`${absoluteSitePaths.index}d%C3%A9veloppeur`,
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
