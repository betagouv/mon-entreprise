import Emoji from '@/components/utils/Emoji'
import { ScrollToTop } from '@/components/utils/Scroll'
import { SitePathsContext } from '@/components/utils/SitePathsContext'
import { Banner, InnerBanner } from '@/design-system/banner'
import { Link } from '@/design-system/typography/link'
import { useFetchData } from '@/hooks/useFetchData'
import { useContext } from 'react'
import { Trans } from 'react-i18next'
import { Route, Routes, useLocation } from 'react-router-dom-v5-compat'
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
	const sitePaths = useContext(SitePathsContext)
	const { pathname } = useLocation()
	const { data: jobOffers } = useFetchData<JobOffer[]>('/data/job-offers.json')
	const openJobOffer = jobOffers?.[0]

	return (
		<TrackChapter chapter1="integration">
			<ScrollToTop />

			{pathname !== sitePaths.développeur.index && (
				<Link
					className="ui__ simple small push-left button"
					to={sitePaths.développeur.index}
				>
					← <Trans>Outils pour les développeurs</Trans> <Emoji emoji="👨‍💻" />
				</Link>
			)}
			{openJobOffer && (
				<Banner>
					<InnerBanner>
						<span>
							<Emoji emoji="📯" />{' '}
							<strong>
								<a href={openJobOffer.link}>Mon-entreprise recrute !</a>
							</strong>{' '}
							<small>{openJobOffer.title}</small>
						</span>
					</InnerBanner>
				</Banner>
			)}
			<Routes>
				<Route path={sitePaths.développeur.index} element={<Options />} />
				<Route path={sitePaths.développeur.iframe} element={<Iframe />} />
				<Route path={sitePaths.développeur.library} element={<Library />} />
				<Route path={sitePaths.développeur.api} element={<API />} />
				<Route
					path={sitePaths.développeur.spreadsheet}
					element={<Spreadsheet />}
				/>
			</Routes>
		</TrackChapter>
	)
}
