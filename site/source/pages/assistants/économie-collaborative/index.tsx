import { Trans } from 'react-i18next'
import { Route, Routes } from 'react-router-dom'
import { styled } from 'styled-components'

import { TrackChapter } from '@/components/ATInternetTracking'
import { Link } from '@/design-system/typography/link'
import { useIsEmbedded } from '@/hooks/useIsEmbedded'
import useSimulatorsData from '@/hooks/useSimulatorsData'
import { useSitePaths } from '@/sitePaths'

import Activité from './Activité'
import ActivitésSelection from './ActivitésSelection'
import { StoreProvider } from './StoreContext'
import VotreSituation from './VotreSituation'

export default function ÉconomieCollaborative() {
	const { relativeSitePaths, absoluteSitePaths } = useSitePaths()
	const { économieCollaborative } = absoluteSitePaths.assistants
	const iframePath =
		useSimulatorsData()['économie-collaborative'].iframePath ?? ''
	const indexPath = useIsEmbedded()
		? encodeURI(`/iframes/${iframePath}`)
		: économieCollaborative.index

	return (
		<TrackChapter chapter1="simulateurs" chapter2="economie_collaborative">
			<div css="transform: translateY(2rem)">
				<StyledLink
					to={indexPath}
					end
					style={({ isActive }) => (isActive ? { display: 'none' } : {})}
				>
					<span aria-hidden>←</span>{' '}
					<Trans i18nKey="économieCollaborative.retourAccueil">
						Retour à la selection d'activités
					</Trans>
				</StyledLink>
			</div>
			<StoreProvider localStorageKey="app::économie-collaborative:v1">
				<Routes>
					<Route index element={<ActivitésSelection />} />
					<Route
						path={
							relativeSitePaths.assistants.économieCollaborative.votreSituation
						}
						element={<VotreSituation />}
					/>
					<Route path={':title'} element={<Activité />} />
				</Routes>
			</StoreProvider>
		</TrackChapter>
	)
}

const StyledLink = styled(Link)`
	text-decoration: none;
`
