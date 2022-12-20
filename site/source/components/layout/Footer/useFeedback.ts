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
			![absoluteSitePaths.index, '', '/'].includes(currentPath) &&
			!['/documentation', '/gérer', '/créer'].some((path) =>
				currentPath.includes(path)
			)
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
