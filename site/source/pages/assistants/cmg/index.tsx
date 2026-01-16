import { Route, Routes } from 'react-router-dom'

import useScrollToTop from '@/components/utils/Scroll/useScrollToTop'
import { CMGProvider } from '@/contextes/cmg'
import { useSimulatorData } from '@/hooks/useSimulatorData'
import SimulateurPageLayout from '@/pages/simulateurs/SimulateurPageLayout'
import { useSitePaths } from '@/sitePaths'

import Accueil from './pages/Accueil'
import Déclarations from './pages/Déclarations'
import Enfants from './pages/Enfants'
import InformationsGénérales from './pages/InformationsGénérales'
import NonÉligible from './pages/NonÉligible'
import Résultat from './pages/Résultat'

const CMG = () => {
	const simulateurConfig = useSimulatorData('cmg')
	useScrollToTop()
	const { relativeSitePaths } = useSitePaths()
	const childrenPaths = relativeSitePaths.assistants.cmg

	return (
		<SimulateurPageLayout simulateurConfig={simulateurConfig} showDate={false}>
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
