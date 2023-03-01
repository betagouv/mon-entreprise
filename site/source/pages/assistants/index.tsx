import { Trans } from 'react-i18next'
import { Route, Routes, useLocation } from 'react-router-dom'

import { TrackChapter } from '@/components/ATInternetTracking'
import PageData from '@/components/PageData'
import Route404 from '@/components/Route404'
import { ScrollToTop } from '@/components/utils/Scroll'
import { Link } from '@/design-system/typography/link'
import useSimulatorsData from '@/hooks/useSimulatorsData'
import { useSitePaths } from '@/sitePaths'

import Embaucher from './embaucher'
import SocialSecurity from './sécurité-sociale'

export default function Gérer() {
	const { relativeSitePaths, absoluteSitePaths } = useSitePaths()
	const location = useLocation()
	const simulateurs = useSimulatorsData()

	const back = (
		<Link noUnderline to={absoluteSitePaths.assistants.index}>
			<span aria-hidden>←</span> <Trans>Retour à mon activité</Trans>
		</Link>
	)

	return (
		<>
			<ScrollToTop key={location.pathname} />

			<TrackChapter chapter1="gerer">
				<Routes>
					{/* <Route index element={<Home />} />  Navigate to /simu-et-assist */}
					<Route
						path={relativeSitePaths.assistants.sécuritéSociale}
						element={
							<>
								{back}
								<SocialSecurity />
							</>
						}
					/>
					<Route
						path={relativeSitePaths.assistants.embaucher}
						element={
							<>
								{back}
								<Embaucher />
							</>
						}
					/>
					{Object.entries(simulateurs)
						.filter(([, simu]) => simu.pathId.startsWith('assistants.'))
						.map(([, simu]) => (
							<Route
								key={simu.path}
								path={
									simu.path.replace(absoluteSitePaths.assistants.index, '') +
									'/*'
								}
								element={
									<>
										{back}
										<PageData />
									</>
								}
							/>
						))}
					<Route path="*" element={<Route404 />} />
				</Routes>
			</TrackChapter>
		</>
	)
}
