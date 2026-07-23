import { Route, Routes } from 'react-router-dom'

import useScrollToTop from '@/components/utils/Scroll/useScrollToTop'
import { CMGProvider } from '@/contextes/cmg'
import { usePageMetadata } from '@/hooks/usePageMetadata'
import SimulateurPageLayout from '@/pages/simulateurs/SimulateurPageLayout'
import { useSitePaths } from '@/sitePaths'

import { CMGMetadata } from './metadata'
import Accueil from './pages/Accueil'
import Déclarations from './pages/Déclarations'
import Enfants from './pages/Enfants'
import InformationsGénérales from './pages/InformationsGénérales'
import NonÉligible from './pages/NonÉligible'
import Résultat from './pages/Résultat'

const CMG = () => {
	const metadata = usePageMetadata(CMGMetadata)
	useScrollToTop()
	const { relativeSitePaths } = useSitePaths()
	const childrenPaths = relativeSitePaths.assistants.cmg

	return (
		<SimulateurPageLayout metadata={metadata} showDate={false}>
			<Routes>
				<Route index element={<Accueil />} />
				<Route
					path={childrenPaths.informations}
					element={<InformationsGénérales />}
				/>
				<Route path={childrenPaths.enfants} element={<Enfants />} />
				<Route path={childrenPaths.déclarations} element={<Déclarations />} />
				<Route path={childrenPaths.inéligibilité} element={<NonÉligible />} />
				<Route path={childrenPaths.résultat} element={<Résultat />} />
			</Routes>
		</SimulateurPageLayout>
	)
}

const CMGWithProvider = () => (
	<CMGProvider>
		<CMG />
	</CMGProvider>
)

export default CMGWithProvider
