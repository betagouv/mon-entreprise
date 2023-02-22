import { Route, Routes } from 'react-router-dom'

import Route404 from '@/components/Route404'
import { useSitePaths } from '@/sitePaths'

import SimulateurPage from '../../components/PageData'
import useSimulatorsData from '../Simulateurs/metadata'

export default function Assistants() {
	const sitePaths = useSitePaths()
	const simulatorsData = useSimulatorsData()

	const routes = Object.entries(simulatorsData)
		.filter(([, simu]) => simu.pathId.startsWith('assistants.'))
		.map(([, simu]) => (
			<Route
				key={simu.path}
				path={simu.path.replace(
					sitePaths.absoluteSitePaths.assistants.index,
					''
				)}
				element={<SimulateurPage {...simu} />}
			/>
		))

	return (
		<Routes>
			{routes}
			<Route path="*" element={<Route404 />} />
		</Routes>
	)
}
