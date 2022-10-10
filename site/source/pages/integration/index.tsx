import Emoji from '@/components/utils/Emoji'
import { ScrollToTop } from '@/components/utils/Scroll'
import { Banner, InnerBanner } from '@/design-system/banner'
import { Link } from '@/design-system/typography/link'
import { useFetchData } from '@/hooks/useFetchData'
import { useSitePaths } from '@/sitePaths'
import { Trans } from 'react-i18next'
import { Route, Routes, useLocation } from 'react-router-dom'
import { TrackChapter } from '../../ATInternetTracking'
import API from './API'
import Iframe from './Iframe'
import Library from './Library'
import Options from './Options'
import Spreadsheet from './Spreadsheet'

type JobOffer = {
	title: string
	link: string
	content: string
}

export default function Integration() {
	const { relativeSitePaths, absoluteSitePaths } = useSitePaths()
	const { pathname } = useLocation()
	const { data: jobOffers } = useFetchData<JobOffer[]>('/data/job-offers.json')
	const openJobOffer = jobOffers?.[0]

	return (
		<TrackChapter chapter1="integration">
			<ScrollToTop />

			{pathname !== absoluteSitePaths.développeur.index && (
				<Link
					className="ui__ simple small push-left button"
					to={absoluteSitePaths.développeur.index}
				>
					<span aria-hidden>←</span> <Trans>Outils pour les développeurs</Trans>{' '}
					<Emoji emoji="👨‍💻" />
				</Link>
			)}
			{openJobOffer && (
				<Banner>
					<InnerBanner>
						<span>
							<Emoji emoji="📯" />{' '}
							<strong>
								<a
									href={openJobOffer.link}
									aria-label="Mon entreprise recrute ! Voir les offres d'emplois de mon-entreprise.urssaf.fr"
								>
									Mon-entreprise recrute !
								</a>
							</strong>{' '}
							<small>{openJobOffer.title}</small>
						</span>
					</InnerBanner>
				</Banner>
			)}
			<Routes>
				<Route index element={<Options />} />
				<Route path={relativeSitePaths.développeur.api} element={<API />} />
				<Route
					path={relativeSitePaths.développeur.iframe}
					element={<Iframe />}
				/>
				<Route
					path={relativeSitePaths.développeur.library}
					element={<Library />}
				/>
				<Route
					path={relativeSitePaths.développeur.spreadsheet}
					element={<Spreadsheet />}
				/>
			</Routes>
		</TrackChapter>
	)
}
