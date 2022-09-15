import { useIsEmbedded } from '@/components/utils/embeddedContext'
import { Link } from '@/design-system/typography/link'
import { useSitePaths } from '@/sitePaths'
import { Trans } from 'react-i18next'
import { Route, Routes } from 'react-router-dom'
import { TrackChapter } from '../../../ATInternetTracking'
import useSimulatorsData from '../metadata'
import Activité from './Activité'
import ActivitésSelection from './ActivitésSelection'
import { StoreProvider } from './StoreContext'
import VotreSituation from './VotreSituation'

export default function ÉconomieCollaborative() {
	const { relativeSitePaths, absoluteSitePaths } = useSitePaths()
	const { économieCollaborative } = absoluteSitePaths.simulateurs
	const iframePath =
		useSimulatorsData()['économie-collaborative'].iframePath ?? ''
	const indexPath = useIsEmbedded()
		? encodeURI(`/iframes/${iframePath}`)
		: économieCollaborative.index

	return (
		<TrackChapter chapter1="simulateurs" chapter2="economie_collaborative">
			<div css="transform: translateY(2rem)">
				<Link
					to={indexPath}
					end
					style={({ isActive }) => (isActive ? { display: 'none' } : {})}
				>
					<span aria-hidden="true">←</span>{' '}
					<Trans i18nKey="économieCollaborative.retourAccueil">
						Retour à la selection d'activités
					</Trans>
				</Link>
			</div>
			<StoreProvider localStorageKey="app::économie-collaborative:v1">
				<Routes>
					<Route index element={<ActivitésSelection />} />
					<Route
						path={
							relativeSitePaths.simulateurs.économieCollaborative.votreSituation
						}
						element={<VotreSituation />}
					/>
					<Route path={':title'} element={<Activité />} />
				</Routes>
			</StoreProvider>
		</TrackChapter>
	)
}
